import type { IStructLog } from '@evm-debuger/types'

import { opcodesDictionary } from './opcodesDictionary'

export const argStackExtractor = (structLog: IStructLog) => {
  const { op, stack } = structLog

  const currentOpcode = opcodesDictionary[op]

  if (!currentOpcode) return null

  const { args, description } = currentOpcode

  const extractedArgs: { name: string; value: string }[] = []

  args.forEach((arg, index) => {
    const value = stack[stack.length - index - 1]
    extractedArgs.push({ value, name: arg })
  })

  return {
    ...structLog,
    description,
    args: extractedArgs.filter((item) => item.name !== 'ignored'),
  }
}
