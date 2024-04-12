import type {
  ISrcMapApiPayload,
  TSolcConfiguration,
  TSourceMap,
  TInputSources,
  SolcOutput,
} from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'
import { captureMessage } from '@sentry/serverless'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type {
  GetObjectCommandInput,
  PutObjectCommandInput,
  PutObjectRequest,
} from '@aws-sdk/client-s3'

import type { TSourceFile } from './types'
import { setDdbContractInfo } from './ddb'
import { SolcManagerStrategy } from './solc.strategy'

const { BUCKET_NAME } = process.env

// =================== S3 =================== //

export const s3 = new S3Client({ region: process.env.AWS_REGION })

export const s3upload = function (params: PutObjectCommandInput) {
  const command = new PutObjectCommand(params)
  return s3.send(command)
}
export const s3download = function (params: GetObjectCommandInput) {
  const command = new GetObjectCommand(params)
  return s3.send(command)
}

// =================== || =================== //

// =================== Helpers =================== //

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

export const createSourceMapEntry = (
  solcOutput: SolcOutput,
  rootContractName: string,
): TSourceMap => {
  const solcOutputContractEntries = Object.entries(solcOutput.contracts)
  const rootContract = solcOutputContractEntries.find(
    ([, contract]) => contract[rootContractName],
  )
  if (rootContract) {
    const [fileName, fileInternals] = rootContract
    const contractInternals = fileInternals[rootContractName]
    const contractDeployedBytecode = contractInternals.evm.deployedBytecode

    const sourceMapContent: TSourceMap = {
      sourceMap: contractDeployedBytecode.sourceMap,
      fileName,
      contractName: rootContractName,
      bytecode: contractDeployedBytecode.object,
    }

    // If the contract has generated sources with Utility.yul it will have array with one element
    // Which is the Utility.yul data
    if (
      contractDeployedBytecode.generatedSources &&
      contractDeployedBytecode.generatedSources.length > 0
    ) {
      sourceMapContent['yulContents'] =
        contractDeployedBytecode.generatedSources[0].contents
      sourceMapContent['ast'] = contractDeployedBytecode.generatedSources[0].ast
    }

    if (contractDeployedBytecode.immutableReferences) {
      sourceMapContent['immutableReferences'] =
        contractDeployedBytecode.immutableReferences
    }

    if (contractDeployedBytecode.functionDebugData) {
      sourceMapContent['functionDebugData'] =
        contractDeployedBytecode.functionDebugData
    }

    if (contractDeployedBytecode.linkReferences) {
      sourceMapContent['linkReferences'] =
        contractDeployedBytecode.linkReferences
    }

    return sourceMapContent
  }
  const message = `/Compilation/No root contract found: ${rootContractName}`
  captureMessage(message, 'error')
  throw new Error(message)
}

// =================== || =================== //

export const compileFiles = async (
  _payload: ISrcMapApiPayload,
): Promise<ISrcMapApiPayload> => {
  console.log(_payload.address, '/Compilation/Start')

  if (!_payload.pathSourceFiles)
    return setCompilationFailed(_payload, '/Compilation/No source files')

  if (!_payload.pathSourceData)
    return setCompilationFailed(_payload, '/Compilation/No source data path')

  const settings: TSolcConfiguration = await fetchSolcSettings(_payload)

  const sourceFiles: TSourceFile[] = (
    await Promise.all(
      _payload.pathSourceFiles.map((item) => fetchSourceFile(item, _payload)),
    )
  ).filter(Boolean) as TSourceFile[]

  let sourceMap: TSourceMap
  let sourcesOrder: Record<number, string> = {}

  try {
    const solcOutput = compile(sourceFiles, settings)

    console.log('solcOutput', solcOutput)

    sourceMap = await createSourceMapEntry(
      solcOutput,
      settings.rootContractName,
    )
    sourcesOrder = createSoruceMapsOrder(solcOutput)
  } catch (error) {
    const message = `/Compilation/Unknow error while compiling:\n${error}`
    captureMessage(message, 'error')
    return setCompilationFailed(_payload, message)
  }

  console.log('sourceMap', sourceMap)
  console.log('sourcesOrder', sourcesOrder)
  console.log('_payload.address', _payload.address)
  console.log('_payload.chainId', _payload.chainId)

  const pathSourceMap = `contracts/${_payload.chainId}/${_payload.address}/sourceMap.json`
  await s3upload({
    Key: pathSourceMap,
    Bucket: BUCKET_NAME,
    Body: JSON.stringify(sourceMap),
  })

  const pathSources = `contracts/${_payload.chainId}/${_payload.address}/contractSources.json`
  await s3upload({
    Key: pathSources,
    Bucket: BUCKET_NAME,
    Body: JSON.stringify(sourcesOrder),
  })

  console.log(_payload.address, '/Compilation/Done')

  return setDdbContractInfo({
    ..._payload,
    status: SrcMapStatus.COMPILATION_SUCCESS,
    pathSources,
    pathSourceMap,
    message: '',
  })
}
