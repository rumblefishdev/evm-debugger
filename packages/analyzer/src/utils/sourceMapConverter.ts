/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-undefined */
import {
  SourceFileType,
  type TOpcodeFromSourceMap,
  type TParseSourceCodeOutput,
  type TParsedSourceMap,
  type TSourceMapCodeRepresentation,
} from '@evm-debuger/types'

import { AlternativeOpcodes, Opcodes } from '../opcodes/opcodes'

type SourceCodeDictionary = Record<string, TParsedSourceMap & TSourceMapCodeRepresentation>

const fileTypeMap = {
  yul: SourceFileType.YUL,
  vy: SourceFileType.VYPER,
  sol: SourceFileType.SOLIDITY,
}

export const getUniqueSourceMaps = (sourceMaps: TParsedSourceMap[]): TParsedSourceMap[] => {
  const uniqueSourceMaps: TParsedSourceMap[] = []

  sourceMaps.forEach((sourceMap) => {
    const isUnique = !uniqueSourceMaps.some((uniqueSourceMap) => {
      return (
        uniqueSourceMap.offset === sourceMap.offset &&
        uniqueSourceMap.length === sourceMap.length &&
        uniqueSourceMap.fileId === sourceMap.fileId &&
        uniqueSourceMap.jumpType === sourceMap.jumpType
      )
    })

    if (isUnique) uniqueSourceMaps.push(sourceMap)
  })

  return uniqueSourceMaps
}

export const createSourceMapIdentifier = (sourceMap: TParsedSourceMap): string => {
  return `${sourceMap.offset}:${sourceMap.length}:${sourceMap.fileId}:${sourceMap.jumpType}`
}

export const convertNewLineExpressionTypeToNumberOfWhitespaces = (sourceCode: string): number => {
  const carriageReturnNewLineRegexp = /\r\n/g
  const newLineRegexp = /\n/g
  const carriageReturnRegexp = /\r/g

  switch (true) {
    case carriageReturnNewLineRegexp.test(sourceCode):
      return 2
    case newLineRegexp.test(sourceCode):
      return 1
    case carriageReturnRegexp.test(sourceCode):
      return 1
    default:
      return 0
  }
}

export const createSourceMapToSourceCodeDictionary = (
  sourceFiles: TParseSourceCodeOutput,
  sourceMaps: TParsedSourceMap[],
): SourceCodeDictionary => {
  const sourceMapToSourceCodeDictionary: SourceCodeDictionary = {}
  const textEncoder = new TextEncoder()

  for (const sourceMap of sourceMaps) {
    const sourceMapIdentifier = createSourceMapIdentifier(sourceMap)

    const sourceCode = sourceFiles[sourceMap.fileId]
    if (sourceCode) {
      const regexForAllNewLineTypes = /\r\n|\n|\r/g
      const sourceParts = sourceCode.content.split(regexForAllNewLineTypes)
      const fileType: SourceFileType = fileTypeMap[sourceCode.sourceName.split('.').pop()]

      const numberOfCharsPerNewLine = convertNewLineExpressionTypeToNumberOfWhitespaces(sourceCode.content)

      let startLine = 0
      let endLine = 0
      let accumulator = 0

      for (let index = 0; index < sourceParts.length; index++) {
        const codePartLength = textEncoder.encode(sourceParts[index]).length + numberOfCharsPerNewLine

        if (accumulator + codePartLength > sourceMap.offset && startLine === 0) {
          startLine = index
        }

        if (accumulator + codePartLength > sourceMap.offset + sourceMap.length && endLine === 0) {
          endLine = index
          break
        }

        accumulator += codePartLength
      }

      sourceMapToSourceCodeDictionary[sourceMapIdentifier] = {
        ...sourceMap,
        startCodeLine: startLine,
        fileType,
        endCodeLine: endLine,
      }
    } else {
      const previousSourceMap = sourceMaps[sourceMaps.indexOf(sourceMap) - 1]
      const previousSourceMapId = createSourceMapIdentifier(previousSourceMap)
      sourceMapToSourceCodeDictionary[sourceMapIdentifier] = {
        ...sourceMapToSourceCodeDictionary[previousSourceMapId],
        fileType: SourceFileType.YUL,
      }
    }
  }

  return sourceMapToSourceCodeDictionary
}

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
        pc,
        opcode: opcodeElement,
      })
      index++
      pc += isPush
    }

    if (!isPush) {
      convertedOpcodes.push({
        pc,
        opcode: opcodeElement,
      })
      pc++
    }
  }

  return convertedOpcodes
}