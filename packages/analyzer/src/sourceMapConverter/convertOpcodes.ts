import { getOpcode, isPushType } from './helpers'
import type { OpcodeElement } from './types'

export const convertOpcodes = (opcodes: string): OpcodeElement[] => {
  const opcodesArray: string[] = opcodes.split(' ')
  const convertedOpcodes: OpcodeElement[] = []

  for (let index = 0; index < opcodesArray.length; index++) {
    const element: string = opcodesArray[index]

    const opcodeElement = getOpcode(element)

    const isPush = isPushType(opcodeElement)

    if (isPush) {
      convertedOpcodes.push({
        payload: opcodesArray[index + 1],
        opcode: opcodeElement,
      })
      index++
    }

    if (!isPush) {
      convertedOpcodes.push({
        payload: '',
        opcode: opcodeElement,
      })
    }
  }

  return convertedOpcodes
}
