/* eslint-disable unicorn/no-keyword-prefix */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PutObjectRequest } from '@aws-sdk/client-s3'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import type { EntryType, SolcOutput } from './types'
import { SourceMapElement } from './sourceMapElement'
import { getLastOpcodeFile } from './opcodesFile'
import { SourceMapElementTree } from './sourceMapElementTree'
import { SourceMapContext } from './sourceMapContext'
import { s3download, s3upload } from './s3'

const { BUCKET_NAME } = process.env

const formatOpcodes = async (opcodesRaw: string): Promise<string> => {
  const opcodeFile = await getLastOpcodeFile()

  const parts = opcodesRaw.split(' ')
  let lastCommand = ''
  let formattedOpcodes: string[] = []
  for (const part of parts)
    if (opcodeFile.opcodes.includes(part)) {
      formattedOpcodes = [...formattedOpcodes, lastCommand]

      lastCommand = part
    } else lastCommand = `${lastCommand} ${part}`

  return formattedOpcodes.join('\n')
}

const formatSourceMap = (
  sourceMapRaw: string,
  sourceCode: string,
  allOpCodes: string[],
): SourceMapElementTree => {
  const sourceMapContext = new SourceMapContext(sourceCode, allOpCodes)

  return SourceMapElementTree.fromElements(
    SourceMapElement.fromSourceMapString(sourceMapRaw, sourceMapContext),
  )
}

const gatherSameSourceCodeElements = (
  els: SourceMapElement[],
): SourceMapElement[] => {
  return els.reduce<SourceMapElement[]>(
    (accumulator, item, index): SourceMapElement[] => {
      const lastItem = accumulator.length > 0 ? accumulator.at(-1) : null
      if (lastItem === null) {
        console.log(1)
        return [item]
      }

      if (
        lastItem &&
        lastItem.start === item.start &&
        item.end === lastItem.end
      ) {
        const lastItemClone = lastItem.clone()
        lastItemClone.addIds(item.ids)
        accumulator.splice(-1)
        return [...accumulator, lastItemClone]
      }

      return [...accumulator, item]
    },
    [],
  )
}

const getInternals = async (
  fileList: string[],
  fileConents: string[],
  solc: any,
) => {
  const input = {
    sources: fileList.reduce((accumulator, current, index) => {
      const key: string = current.split('contract_files/').pop() || ''
      return {
        ...accumulator,
        [key]: {
          content: fileConents[index],
        },
      }
    }, {}),
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
    language: 'Solidity',
  }
  const output: SolcOutput = JSON.parse(
    solc.compile(JSON.stringify(input)),
  ) as SolcOutput

  let allEntries: EntryType[] = []
  for (const [fileName, fileInternals] of Object.entries(output.contracts)) {
    const newEntries: EntryType[] = await Promise.all(
      Object.entries(fileInternals).map(
        async ([contractName, contractInternals]) => {
          const formattedOpcodes = await formatOpcodes(
            contractInternals.evm.deployedBytecode.opcodes,
          )
          const formattedOpcodesArr = formattedOpcodes.split('\n')

          formattedOpcodesArr.shift()
          return {
            rawSourceMap: contractInternals.evm.deployedBytecode.sourceMap,
            fileName,
            contractName,
          }
        },
      ),
    )
    allEntries = [...allEntries, ...newEntries]
  }
  return allEntries
}

export const compileFiles = async (payload: any, solc: any) => {
  const files = await Promise.all(
    payload.files.map(async (solFile: string) => {
      const params: PutObjectRequest = {
        Key: solFile,
        Bucket: BUCKET_NAME,
      }
      const resp = await s3download(params)
      return await resp.Body?.transformToString('utf8')
    }),
  )
  const internals = await getInternals(payload.files, files, solc)
  const params: PutObjectRequest = {
    Key: `contracts/${payload.chainId}/${payload.address}/payload.json`,
    Bucket: BUCKET_NAME,
  }
  try {
    const resp = await s3download(params)
    const existingResponse = JSON.parse(
      (await resp.Body?.transformToString('utf8')) || '',
    )
    existingResponse.status = TransactionTraceResponseStatus.SUCCESS
    existingResponse.srcmap = internals
    await s3upload({
      ...params,
      Body: JSON.stringify(existingResponse),
    })
  } catch (error) {
    console.log(error)
  }
  return internals
}
