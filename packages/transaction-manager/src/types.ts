import type { ChainIds } from '@evm-debuger/config'
import type {
  TEtherscanContractSourceCodeResult,
  TEtherscanParsedSourceCode,
  TExtractedSourceFiles,
  TSolcConfiguration,
} from '@evm-debuger/types'

export type TTempExecs = {
  chainId: ChainIds
  forkBlockNumber: number
  forkingUrl: string
}

export type Contract = {
  evm: {
    bytecode: {
      object: string
      opcodes: string
      sourceMap: string
    }
    deployedBytecode: {
      object: string
      opcodes: string
      sourceMap: string
    }
    assembly: string
  }
}

export type Source = { id: number }

export type SolcOutput = {
  contracts: Record<string, Record<string, Contract>>
  sources: Record<string, Source>
}

export interface SolcManager {
  compile: (input: TEtherscanParsedSourceCode) => string
}

export interface SourceCodeManager {
  extractFiles: (sourceData: TEtherscanContractSourceCodeResult) => TExtractedSourceFiles
  createSettingsObject: (sourceData: TEtherscanContractSourceCodeResult) => TSolcConfiguration
}
