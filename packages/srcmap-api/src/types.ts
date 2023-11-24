import type {
  ISrcMapApiPayload,
  TEtherscanContractSourceCodeResult,
} from '@evm-debuger/types'

export interface IFetcherPayload {
  payload: ISrcMapApiPayload
  sourceData?: TEtherscanContractSourceCodeResult
}
