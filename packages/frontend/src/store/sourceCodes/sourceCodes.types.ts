import type { TAbi, TSourceMap } from '@evm-debuger/types'

export type TContractsSources = Record<
  string,
  {
    contractName: string
    sourceCode: string
    abi: TAbi
    srcMap: TSourceMap[]
  }
>
