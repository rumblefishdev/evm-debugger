import type { TContractStructlogsPerStartLine } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedStructlogsPerActiveLine = (address?: string): Record<string, TContractStructlogsPerStartLine> => {
  const generatedAddress = createUUID()
  const addressToUse = address || generatedAddress
  return {
    [addressToUse]: {
      structlogsPerStartLine: {
        0: {
          0: [
            {
              storage: {},
              stack: [],
              pc: 0,
              op: 'PUSH1',
              memory: [],
              index: 0,
              gasCost: 0,
              gas: 0,
              depth: 0,
            },
          ],
        },
      },
      address: addressToUse,
    },
  }
}
