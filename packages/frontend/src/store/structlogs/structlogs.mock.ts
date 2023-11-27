import type { IStructLog } from '@evm-debuger/types'

export const createMockedStructlog = (index: number): IStructLog => ({
  storage: {},
  stack: [],
  pc: index,
  op: 'CALL',
  memory: [],
  index,
  gasCost: 0,
  gas: 0,
  depth: 0,
})

export const createMockedStructLogs = (length: number): IStructLog[] => {
  const structLogs: IStructLog[] = []

  for (let index = 0; index < length; index++) {
    structLogs.push(createMockedStructlog(index))
  }

  return structLogs
}
