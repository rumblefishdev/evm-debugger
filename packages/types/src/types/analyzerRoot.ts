import type { TOpcodesNames } from './opcodes/opcodesHex'
import type { TContractBytecodeObject } from './solc'
import type { TIndexedStructLog } from './structLogs'
import type { TTraceLog } from './traceLogs'
import type {
  TAbi,
  TContractDissasembledBytecode,
  TDisassembledBytecode,
  TPcIndexedStepInstructions,
  TSighashStatus,
  TStructlogsPerStartLine,
  TTransactionInfo,
} from './types'
import type { TYulBlock } from './yulSources'

export type TSourceData = {
  contractName?: string
  compilerVersion?: string
  optimizationUsed?: string
  runs?: string
  constructorArguments?: string
  evmVersion?: string
  library?: string
  licenseType?: string
  proxy?: string
  implementation?: string
  swarmSource?: string
}

export type TInputContractData = {
  address: string
  sourceMap?: string
  bytecode?: string
  etherscanBytecode?: string
  applicationBinaryInterface?: TAbi
  sourceCode?: string
  yulSource?: string
  yulTree?: TYulBlock
  sourceFilesOrder?: Record<number, string>
  sourceData?: TSourceData
  immutableReferences?: TContractBytecodeObject['immutableReferences']
  functionDebugData?: TContractBytecodeObject['functionDebugData']
  linkReferences?: TContractBytecodeObject['linkReferences']
}

export type TAnalyzerContractBaseData = {
  address: string
  name?: string
  compilerVersion?: string
  optimization?: { isEnabled: boolean; runs: number }
  evmVersion?: string
  license?: string
}

export type TSourceFile = {
  content: string
  path: string
  name: string
}

export type TContractFunctionInputParameter = {
  // uint256
  type: string
  // amount
  name: string
  // [ calldata, memory ]
  modifiers: string[]
  // 0
  value?: string
  stackInitialIndex: number
}

export type TContractFunctionOutputParameter = {
  type: string
  value?: string
}

export type TContractFunction = {
  // verify(address,uint256)
  selector: string
  // verify
  name: string

  // [ 'public', 'view' ]
  functionModifiers: string[]

  inputs: TContractFunctionInputParameter[]
  outputs: TContractFunctionOutputParameter[]

  pc: number
  index: number
  op: TOpcodesNames

  hasAbi: boolean
  isMain: boolean
  isYul: boolean
  contraceName: string
  depth: number
  nestedFunctions?: string[]
}

export type TAnalyzerContractData = {
  address: string
  contractBaseData?: TAnalyzerContractBaseData
  disassembledBytecode?: TDisassembledBytecode
  disassembledEtherscanBytecode?: TDisassembledBytecode
  sourceFiles?: TSourceFile[]
  instructions?: TPcIndexedStepInstructions
  structlogsPerStartLine?: TStructlogsPerStartLine
  functions?: Record<number, TContractFunction>
  runtimeFunctionsList?: Record<number, TContractFunction[]>
}

export type TDataLoaderInputData = {
  transactionInfo: TTransactionInfo
  structLogs: TIndexedStructLog[]
  contracts: Record<string, TInputContractData>
}
export type TDataLoaderAnalyzerData = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  traceLogs: TTraceLog[]
  sighashes: Record<string, TSighashStatus>
  contracts: Record<string, TAnalyzerContractData>
}

export type TContractInstructions = {
  address: string
  instructions: TPcIndexedStepInstructions
}

export type TContractStructlogsPerStartLine = {
  address: string
  structlogsPerStartLine: TStructlogsPerStartLine
}

export type TContractSourceFiles = {
  address: string
  sourceFiles: TSourceFile[]
}

export type TFunctionStack = {
  index: number
  functions: TContractFunction[]
}

export type TAnalyzerAnalysisOutput = {
  structLogs: TIndexedStructLog[]
  transactionInfo: TTransactionInfo
  traceLogs: TTraceLog[]
  sighashes: Record<string, TSighashStatus>
  contractsBaseData: Record<string, TAnalyzerContractBaseData>
  contractsDisassembledBytecodes: Record<string, TContractDissasembledBytecode>
  contractsInstructions: Record<string, TContractInstructions>
  contractsStructLogsPerLine: Record<string, TContractStructlogsPerStartLine>
  contractsSourceFiles: Record<string, TContractSourceFiles>
  traceLogsFunctionsStack: Record<number, TFunctionStack>
}

export type TAnalyzerContractRawData = {
  address: string
  sourceMap?: string
  bytecode?: string
  etherscanBytecode?: string
  applicationBinaryInterface?: TAbi
}
export type TAnalyzerContractsRawData = Record<string, TAnalyzerContractRawData>
