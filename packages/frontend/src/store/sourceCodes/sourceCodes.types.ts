import type { TAbi, TSourceMap, ISrcMapApiPayload } from '@evm-debuger/types'

export type TContractsSources = Record<
  string,
  {
    contractName: string
    sourceCode: string
    abi: TAbi
    srcMap: TSourceMap[]
  }
>

export type TRawContractsData = Record<string, ISrcMapApiPayload>

export type TSourceCodes = { address: string; sourceCode: string | null; sourcesOrder: Record<number, string> | null; yulSource?: string }
