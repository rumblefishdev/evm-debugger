/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PutObjectRequest } from '@aws-sdk/client-s3'

import { SourceMapElement } from './sourceMapElement'
import { addNewPotentialOpcodes, getLastOpcodeFile } from './opcodesFile'
import type { EntryType, SolcOutput } from './types'
import { SourceMapElementTree } from './sourceMapElementTree'
import { SourceMapContext } from './sourceMapContext'
import { s3download } from './s3'

const { BUCKET_NAME, AWS_REGION } = process.env

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

      // console.log('reduce', idx, acc.length, { start: lastItem.start, end: lastItem.end, sourceSt: lastItem.sourceString, ids: lastItem.ids }, {start: item.start, end: item.end, sourceSt: lastItem.sourceString })
      if (lastItem.start === item.start && item.end === lastItem.end) {
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
      const fileContent = JSON.parse(fileConents[index]).parsed
      return {
        ...accumulator,
        [current]: {
          content: fileContent,
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
  console.log(output)
  const allEntries: EntryType[] = []
  // for (const [fileName, fileInternals] of Object.entries(output.contracts)) {
  //   const newEntries: EntryType[] = await Promise.all(
  //     Object.entries(fileInternals).map(
  //       async ([contractName, contractInternals]) => {
  //         const formattedOpcodes = await formatOpcodes(
  //           contractInternals.evm.deployedBytecode.opcodes,
  //         )
  //         const formattedOpcodesArr = formattedOpcodes.split('\n')

  //         formattedOpcodesArr.shift()

  //         console.log({
  //           test: formatSourceMap(
  //             contractInternals.evm.deployedBytecode.sourceMap,
  //             contractCode,
  //             formattedOpcodesArr,
  //           ).shrinkTree().rootNode.element,
  //         })
  //         return {
  //           sourceMap: formatSourceMap(
  //             contractInternals.evm.deployedBytecode.sourceMap,
  //             contractCode,
  //             formattedOpcodesArr,
  //           ).shrinkTree(),
  //           opcodesRaw: contractInternals.evm.deployedBytecode.opcodes,
  //           opcodes: formattedOpcodes,
  //           fileName,
  //           contractName,
  //         }
  //       },
  //     ),
  //   )

  return allEntries // [...allEntries, ...newEntries]
}

export const compileFiles = async (payload: any, solc: any) => {
  const files = await Promise.all(
    payload.files.map(async (solFile: string) => {
      const params: PutObjectRequest = {
        Key: solFile,
        Bucket: BUCKET_NAME,
      }
      const resp = await s3download(params)
      const parsed = await resp.Body?.transformToString('utf8')
      return JSON.stringify({ parsed })
    }),
  )
  return await getInternals(payload.files, files, solc)
}
