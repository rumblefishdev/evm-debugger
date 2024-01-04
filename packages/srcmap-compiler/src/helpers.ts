/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PutObjectRequest } from '@aws-sdk/client-s3'
import type {
  ISrcMapApiPayload,
  TEtherscanContractSourceCodeResult,
  TSolcConfiguration,
  TSourceMap,
} from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'
import { captureMessage } from '@sentry/serverless'

import type { TSourceFile } from './types'
import { setDdbContractInfo } from './ddb'
import { s3upload, s3download } from './s3'
import { SolcManager } from './solc.strategy'

const { BUCKET_NAME } = process.env

const getSourceMap = async (
  files: TSourceFile[],
  solcConfiguration: TSolcConfiguration,
): Promise<{
  generatedSourceMaps: TSourceMap[]
  sources: Record<number, string>
}> => {
  console.log('getSourceMap - files', files)
  console.log('getSourceMap - solcConfiguration', solcConfiguration)

  const input = {
    sources: files.reduce((accumulator, current) => {
      const key: string = current.path.split('contract_files/').pop() || ''
      return {
        ...accumulator,
        [key]: {
          content: current.content,
        },
      }
    }, {}),
    settings: {
      ...solcConfiguration.settings,
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
    language: solcConfiguration.language,
  }

  const solcManager = new SolcManager('')

  console.log('solc input', input)

  const compilationResult = solcManager.compile(input)

  console.log('compilation success')

  let generatedSourceMaps: TSourceMap[] = []
  for (const [fileName, fileInternals] of Object.entries(
    compilationResult.contracts,
  )) {
    const newerEntries: TSourceMap[] = await Promise.all(
      Object.entries(fileInternals).map(([contractName, contractInternals]) => {
        return {
          fileName,
          deployedBytecode: contractInternals.evm.deployedBytecode,
          contractName,
          bytecode: contractInternals.evm.bytecode,
        }
      }),
    )
    generatedSourceMaps = [...generatedSourceMaps, ...newerEntries]
  }
  const sources = Object.entries(compilationResult.sources).reduce(
    (accumulator: Record<number, string>, [key, value]) => {
      accumulator[value.id] = key
      return accumulator
    },
    {},
  )
  return { sources, generatedSourceMaps }
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

  const settingsResponse = await s3download({
    Key: _payload.pathCompilatorSettings,
    Bucket: BUCKET_NAME,
  })
  const settings: TSolcConfiguration = JSON.parse(
    (await settingsResponse.Body?.transformToString('utf8')) || '',
  )

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
  let sourcesOrder: Record<number, string> = {}

  console.log('Pres getSourceMap - sourceFiles', sourceFiles)

  try {
    const { generatedSourceMaps, sources } = await getSourceMap(
      sourceFiles,
      settings,
    )
    sourceMaps = generatedSourceMaps
    sourcesOrder = sources
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

  const pathSources = `contracts/${_payload.chainId}/${_payload.address}/contractSources.json`
  await s3upload({
    Key: pathSources,
    Bucket: BUCKET_NAME,
    Body: JSON.stringify(sourcesOrder),
  })

  return setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATION_SUCCESS,
    pathSources,
    pathSourceMaps,
    message: '',
  })
}
