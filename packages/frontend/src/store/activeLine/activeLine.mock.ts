import type { TStructlogsPerStartLine } from '@evm-debuger/types'

export const createMockedStructlogsPerActiveLine = (address?: string): Record<string, TStructlogsPerStartLine> => {
  return {
    [address || '0x0']: {
      1: {
        0: new Set(),
      },
      0: {
        1: new Set(),
        0: new Set(),
      },
    },
  }
}
