import type { TOpcodeFromSourceMap, TParsedSourceMap } from '@evm-debuger/types'

import { AlternativeOpcodes, Opcodes } from '../opcodes'

export const sourceMapConverter = (sourceMap: string): TParsedSourceMap[] => {
  const sourceMapArray: string[] = sourceMap.split(';')
  const convertedSourceMap: TParsedSourceMap[] = []

  for (let index = 0; index < sourceMapArray.length; index++) {
    const element: string = sourceMapArray[index]
    const [offset, length, fileId, jumpType] = element.split(':')

    const hasStart = offset !== undefined && offset !== ''
    const hasLength = length !== undefined && length !== ''
    const hasFileId = fileId !== undefined && fileId !== ''
    const hasJump = jumpType !== undefined && jumpType !== ''

    const hasEveryPart = hasStart && hasLength && hasFileId && hasJump

    if (hasEveryPart) {
      convertedSourceMap.push({
        offset: parseInt(offset, 10),
        length: parseInt(length, 10),
        jumpType,
        fileId: parseInt(fileId, 10),
      })
    }

    if (!hasEveryPart) {
      convertedSourceMap.push({
        offset: hasStart ? parseInt(offset, 10) : convertedSourceMap[index - 1].offset,
        length: hasLength ? parseInt(length, 10) : convertedSourceMap[index - 1].length,
        jumpType: hasJump ? jumpType : convertedSourceMap[index - 1].jumpType,
        fileId: hasFileId ? parseInt(fileId, 10) : convertedSourceMap[index - 1].fileId,
      })
    }

    if (index === 0 && !hasEveryPart) {
      convertedSourceMap.push({
        offset: 0,
        length: 0,
        jumpType: '-',
        fileId: 0,
      })
    }
  }

  return convertedSourceMap
}

export const getOpcode = (opcode: string): Opcodes => {
  return Opcodes[opcode] || AlternativeOpcodes[opcode] || opcode
}

export const isPushType = (opcode: Opcodes): number => {
  const decimalOpcode = parseInt(opcode, 16)

  const decimalPush0Opcode = parseInt(Opcodes.PUSH0, 16)
  const decimalPush32Opcode = parseInt(Opcodes.PUSH32, 16)

  return decimalOpcode >= decimalPush0Opcode && decimalOpcode <= decimalPush32Opcode ? decimalOpcode - decimalPush0Opcode + 1 : 0
}

export const opcodesConverter = (opcodes: string): TOpcodeFromSourceMap[] => {
  const opcodesArray: string[] = opcodes.split(' ')
  const convertedOpcodes: TOpcodeFromSourceMap[] = []

  let pc = 0
  for (let index = 0; index < opcodesArray.length; index++) {
    const element: string = opcodesArray[index]

    const opcodeElement = getOpcode(element)

    const isPush = isPushType(opcodeElement)

    if (isPush) {
      convertedOpcodes.push({
        pc: `0x${pc.toString(16)}`,
        opcode: opcodeElement,
      })
      index++
      pc += isPush
    }

    if (!isPush) {
      convertedOpcodes.push({
        pc: `0x${pc.toString(16)}`,
        opcode: opcodeElement,
      })
      pc++
    }
  }

  return convertedOpcodes
}
