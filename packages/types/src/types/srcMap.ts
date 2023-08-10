import type { ChainId } from './chains'

export enum SrcMapResponseStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  BUILDING = 'BUILDING',
  COMPILING = 'COMPILING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export type TSrcMapInputAddress = {
  address: string
  chainId: ChainId
}
