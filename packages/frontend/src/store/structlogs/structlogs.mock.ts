import type { TIndexedStructLog } from '@evm-debuger/types'

export const createMockedStructlog = (index: number): TIndexedStructLog => ({
  storage: {},
  stack: [],
  pc: index,
  op: 'CALL',
  memory: [],
  index,
  gasCost: 0,
  gas: 0,
  dynamicGasCost: 3,
  depth: 0,
})

export const createMockedStructLogs = (length: number): TIndexedStructLog[] => {
  const structLogs: TIndexedStructLog[] = []

  for (let index = 0; index < length; index++) {
    structLogs.push(createMockedStructlog(index))
  }

  return structLogs
}
