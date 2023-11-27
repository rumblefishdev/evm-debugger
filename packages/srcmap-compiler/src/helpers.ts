/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PutObjectRequest } from '@aws-sdk/client-s3'
import type {
  ISrcMapApiPayload,
  TEtherscanContractSourceCodeResult,
  TEtherscanParsedSourceCode,
  TSourceMap,
} from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'
import { captureMessage } from '@sentry/serverless'

import type { SolcOutput, TSourceFile } from './types'
import { SourceMapElement } from './sourceMapElement'
import { getLastOpcodeFile } from './opcodesFile'
import { SourceMapElementTree } from './sourceMapElementTree'
import { SourceMapContext } from './sourceMapContext'
import solc from './solc'
import { setDdbContractInfo } from './ddb'
import { s3upload, s3download } from './s3'

const { BUCKET_NAME } = process.env

const isMultipleFilesJSON = (sourceCode: string) =>
  sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

const createSettingsObject = (
  sourceData: TEtherscanContractSourceCodeResult,
): TEtherscanParsedSourceCode['settings'] => {
  const hasMultipleSources = isMultipleFilesJSON(sourceData.SourceCode)

  if (hasMultipleSources) {
    const rawSourceCode = sourceData.SourceCode.replace(/(\r\n)/gm, '').slice(
      1,
      -1,
    )

    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    return sourceCodeObj.settings
  }
  return {
    optimizer: {
      runs: Number(sourceData.Runs),
      enabled: sourceData.OptimizationUsed === '1',
    },
  }
}

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
  settings: TEtherscanParsedSourceCode['settings'],
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
      ...settings,
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },

    language: 'Solidity',
  }
  console.log('input', JSON.stringify(input))

  const rawCompilationResult = solc.compile(JSON.stringify(input))

  const output: SolcOutput = JSON.parse(rawCompilationResult) as SolcOutput

  console.log('output', JSON.stringify(output))

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
): Promise<ISrcMapApiPayload> => {
  console.log(_payload.address, '/Compilation/Start')

  if (!_payload.pathSourceFiles) {
    const message = '/Compilation/No files to compile'
    console.warn(_payload.address, message)
    return setDdbContractInfo({
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }

  if (!_payload.pathSourceData) {
    const message = '/Compilation/No source data path'
    console.warn(_payload.address, message)
    return setDdbContractInfo({
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }

  const sourceDataResp = await s3download({
    Key: _payload.pathSourceData,
    Bucket: BUCKET_NAME,
  })

  const sourceData: TEtherscanContractSourceCodeResult = JSON.parse(
    (await sourceDataResp.Body?.transformToString('utf8')) || '',
  )

  if (!sourceData) {
    const message = '/Compilation/No source data'
    console.warn(_payload.address, message)
    return setDdbContractInfo({
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }

  const settings = createSettingsObject(sourceData)

  console.log(`Settings ${_payload.address}`, settings)

  const sourceFiles: TSourceFile[] = (
    await Promise.all(
      _payload.pathSourceFiles.map(async (path: string) => {
        const params: PutObjectRequest = {
          Key: path,
          Bucket: BUCKET_NAME,
        }

        let content: string
        try {
          const resp = await s3download(params)
          content = (await resp.Body?.transformToString('utf8')) as string
        } catch (error) {
          const message = `/Compilation/No File on S3: ${path}`
          console.warn(_payload.address, message)
          captureMessage(message, 'error')
          return null
        }
        return { path, content }
      }),
    )
  ).filter(Boolean) as TSourceFile[]

  let sourceMaps: TSourceMap[] = []
  try {
    sourceMaps = await getSourceMap(sourceFiles, settings)
    console.log(`${_payload.address} sourceMaps`, sourceMaps)
  } catch (error) {
    const message = `/Compilation/Unknow error while compiling:\n${error}`
    console.warn(_payload.address, message)
    captureMessage(message, 'error')
    return setDdbContractInfo({
      ..._payload,
      status: SrcMapStatus.COMPILATION_FAILED,
      message,
    })
  }

  console.log(_payload.address, '/Compilation/Done')
  const pathSourceMaps = await Promise.all(
    sourceMaps.map(async (sourceMap) => {
      const path = `contracts/${_payload.chainId}/${_payload.address}/source_maps/${sourceMap.fileName}_${sourceMap.contractName}`
      await s3upload({
        Key: path,
        Bucket: BUCKET_NAME,
        Body: JSON.stringify(sourceMap),
      })
      return path
    }),
  )

  return setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATION_SUCCESS,
    pathSourceMaps,
  })
}
