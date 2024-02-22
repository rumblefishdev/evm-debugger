import { SrcMapStatus } from '@evm-debuger/types'
import type {
  TSolcConfiguration,
  ISrcMapApiPayload,
  TSourceMap,
  TInputSources,
  SolcOutput,
} from '@evm-debuger/types'
import type { PutObjectRequest } from '@aws-sdk/client-s3'
import { captureMessage } from '@sentry/serverless'

import { setDdbContractInfo } from '../ddb'
import { s3download } from '../s3'
import type { TSourceFile } from '../types'

import { SolcManagerStrategy } from './solc.strategy'

const { BUCKET_NAME } = process.env

export const setCompilationFailed = (
  payload: ISrcMapApiPayload,
  message: string,
): Promise<ISrcMapApiPayload> => {
  console.warn(payload.address, message)
  return setDdbContractInfo({
    ...payload,
    status: SrcMapStatus.COMPILATION_FAILED,
    message,
  })
}

export const fetchSolcSettings = async (payload: ISrcMapApiPayload) => {
  const settingsResponse = await s3download({
    Key: payload.pathCompilatorSettings,
    Bucket: BUCKET_NAME,
  })
  const settings: TSolcConfiguration = JSON.parse(
    (await settingsResponse.Body?.transformToString('utf8')) || '',
  )

  return settings
}

export const fetchSourceFile = async (
  path: string,
  payload: ISrcMapApiPayload,
): Promise<TSourceFile | null> => {
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
    console.warn(payload.address, message)
    captureMessage(message, 'error')
    return null
  }
  return { path, content }
}

export const createSource = (
  accumulator: TInputSources,
  file: TSourceFile,
): TInputSources => {
  const key: string = file.path.split('contract_files/').pop() || ''
  return {
    ...accumulator,
    [key]: {
      content: file.content,
    },
  }
}

export const createSources = (files: TSourceFile[]): TInputSources => {
  return files.reduce<TInputSources>(createSource, {})
}

export const compile = (
  files: TSourceFile[],
  solcConfiguration: TSolcConfiguration,
): SolcOutput => {
  const input = {
    sources: createSources(files),
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

  const solcManager = new SolcManagerStrategy(
    solcConfiguration.solcCompilerVersion,
  )

  return solcManager.compile(input)
}

export const createSoruceMapsOrder = (
  solcOutput: SolcOutput,
): Record<number, string> => {
  return Object.entries(solcOutput.sources).reduce(
    (accumulator: Record<number, string>, [key, value]) => {
      accumulator[value.id] = key
      return accumulator
    },
    {},
  )
}

export const createSourceMapsEntries = async (
  solcOutput: SolcOutput,
  rootContractName: string,
): Promise<TSourceMap[]> => {
  let generatedSourceMaps: TSourceMap[] = []
  for (const [fileName, fileInternals] of Object.entries(
    solcOutput.contracts,
  )) {
    const newerEntries: TSourceMap[] = await Promise.all(
      Object.entries(fileInternals).map(([contractName, contractInternals]) => {
        return {
          fileName,
          deployedBytecode: {
            sourceMap: contractInternals.evm.deployedBytecode.sourceMap,
            opcodes: contractInternals.evm.deployedBytecode.opcodes,
            object: contractInternals.evm.deployedBytecode.object,
            ast:
              contractInternals.evm.deployedBytecode.generatedSources[0]?.ast ||
              {},
          },
          contractName,
        }
      }),
    )
    generatedSourceMaps = [...generatedSourceMaps, ...newerEntries]
  }

  return generatedSourceMaps
}
