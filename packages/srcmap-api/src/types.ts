import type {
  ISrcMapApiPayload,
  TEtherscanContractSourceCodeResult,
  TExtractedSourceFiles,
  TSolcConfiguration,
} from '@evm-debuger/types'

export interface IFetcherPayload {
  payload: ISrcMapApiPayload
  sourceData?: TEtherscanContractSourceCodeResult
}

export interface SourceCodeManager {
  extractFiles: (
    sourceData: TEtherscanContractSourceCodeResult,
  ) => TExtractedSourceFiles
  createSettingsObject: (
    sourceData: TEtherscanContractSourceCodeResult,
  ) => TSolcConfiguration
}
