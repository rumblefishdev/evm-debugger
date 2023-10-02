/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PutObjectRequest } from '@aws-sdk/client-s3'
import type { ISrcMapApiPayload, TSourceMap } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

import type { SolcOutput, TSourceFile } from './types'
import { SourceMapElement } from './sourceMapElement'
import { getLastOpcodeFile } from './opcodesFile'
import { SourceMapElementTree } from './sourceMapElementTree'
import { SourceMapContext } from './sourceMapContext'
import { payloadSync, s3download, s3upload } from './s3'
import solc from './solc'

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

const getSourceMap = async (
  files: TSourceFile[],
  optimizerConfig: { enabled: boolean; runs: number },
): Promise<TSourceMap[]> => {
  const input = {
    sources: files.reduce((accumulator, current, index) => {
      const key: string = current.path.split('contract_files/').pop() || ''
      return {
        ...accumulator,
        [key]: {
          content: current.content,
        },
      }
    }, {}),
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
      optimizer: optimizerConfig,
    },
    language: 'Solidity',
  }
  const output: SolcOutput = JSON.parse(
    solc.compile(JSON.stringify(input)),
  ) as SolcOutput

  let allEntries: TSourceMap[] = []
  for (const [fileName, fileInternals] of Object.entries(output.contracts)) {
    const newerEntries: TSourceMap[] = await Promise.all(
      Object.entries(fileInternals).map(([contractName, contractInternals]) => {
        return {
          fileName,
          deployedBytecode: {
            sourceMap: contractInternals.evm.deployedBytecode.sourceMap,
            opcodes: contractInternals.evm.deployedBytecode.opcodes,
            object: contractInternals.evm.deployedBytecode.object,
          },
          contractName,
          bytecode: {
            sourceMap: contractInternals.evm.bytecode.sourceMap,
            opcodes: contractInternals.evm.bytecode.opcodes,
            object: contractInternals.evm.bytecode.object,
          },
        }
      }),
    )
    allEntries = [...allEntries, ...newerEntries]
  }
  return allEntries
}

export const compileFiles = async (
  _payload: ISrcMapApiPayload,
  payloadS3Params: PutObjectRequest,
): Promise<ISrcMapApiPayload> => {
  console.log(_payload.address, '/Compilation/Start')

  if (!_payload.filesPath) {
    const msg = '/Compilation/No files to compile'
    console.warn(_payload.address, msg)
    return payloadSync(payloadS3Params, {
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message: msg,
    })
  }

  const sourceFiles: TSourceFile[] = (
    await Promise.all(
      _payload.filesPath.map(async (path: string) => {
        const params: PutObjectRequest = {
          Key: path,
          Bucket: BUCKET_NAME,
        }

        let content: string
        try {
          const resp = await s3download(params)
          content = (await resp.Body?.transformToString('utf8')) as string
        } catch (error) {
          const msg = `/Compilation/No File on S3: ${path}`
          console.warn(_payload.address, msg)
          // Todo add sentry request
          return null
        }
        return { path, content }
      }),
    )
  ).filter(Boolean) as TSourceFile[]

  let sourceMaps: TSourceMap[] = []
  try {
    sourceMaps = await getSourceMap(sourceFiles, {
      runs: Number(_payload.sourceData?.Runs),
      enabled: Boolean(_payload.sourceData?.OptimizationUsed),
    })
  } catch (error) {
    const msg = `/Compilation/Unknow error while compiling:\n${error}`
    console.warn(_payload.address, msg)
    // Todo add sentry request
    return payloadSync(payloadS3Params, {
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message: msg,
    })
  }

  console.log(_payload.address, '/Compilation/Done')
  return payloadSync(payloadS3Params, {
    ..._payload,
    status: SrcMapStatus.COMPILATION_SUCCESS,
    sourceMaps,
  })
}
