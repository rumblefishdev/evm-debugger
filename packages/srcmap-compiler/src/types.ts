import type {
  ISrcMapApiPayload,
  TEtherscanParsedSourceCode,
} from '@evm-debuger/types'

export type TSourceFile = {
  path: string
  content: string
}

export type TSrcMapCompilerHandler = {
  payload: ISrcMapApiPayload
  initialLambdaRequestId: string
}

export interface SolcManager {
  compile: (input: TEtherscanParsedSourceCode) => string
}
