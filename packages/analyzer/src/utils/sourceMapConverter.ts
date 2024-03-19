/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-undefined */
import type { TAnalyzerContractData, TParsedSourceMap, TSourceMapCodeRepresentation } from '@evm-debuger/types'
import { BaseOpcodesHex, SourceFileType } from '@evm-debuger/types'

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

export const regexForAllNewLineTypes = /\r\n|\n|\r/g

export const createSourceMapToSourceCodeDictionary = (
  sourceFiles: TAnalyzerContractData['sourceFiles'],
  sourceMaps: TParsedSourceMap[],
): SourceCodeDictionary => {
  const sourceMapToSourceCodeDictionary: SourceCodeDictionary = {}
  const textEncoder = new TextEncoder()

  for (const sourceMap of sourceMaps) {
    const sourceMapIdentifier = createSourceMapIdentifier(sourceMap)

    const sourceCode = sourceFiles[sourceMap.fileId]

    if (sourceCode) {
      const sourceParts = sourceCode.content.split(regexForAllNewLineTypes)
      const fileType: SourceFileType = fileTypeMap[sourceCode.path.split('.').pop()]

      const numberOfCharsPerNewLine = convertNewLineExpressionTypeToNumberOfWhitespaces(sourceCode.content)

      let startLine = 0
      let startColumn = 0
      let endLine = 0
      let endColumn = 0
      let accumulator = 0

      for (let index = 0; index < sourceParts.length; index++) {
        const codePartLength = textEncoder.encode(sourceParts[index]).length + numberOfCharsPerNewLine

        if (accumulator + codePartLength > sourceMap.offset && startLine === 0) {
          startLine = index
          startColumn = sourceMap.offset - accumulator
        }

        if (accumulator + codePartLength > sourceMap.offset + sourceMap.length && endLine === 0) {
          endLine = index
          endColumn = sourceMap.offset + sourceMap.length - accumulator
          break
        }

        accumulator += codePartLength
      }

      const sourceCodeContent = sourceParts.slice(startLine, endLine + 1).join(' ')

      const isSourceFunction =
        sourceCodeContent.includes('function') &&
        sourceCodeContent.includes('{') &&
        sourceCodeContent.includes('}') &&
        !sourceCodeContent.includes('contract') &&
        sourceMap.jumpType !== 'o'
      const sourceFunctionSingature = isSourceFunction && sourceCodeContent.slice(0, sourceCodeContent.indexOf(')') + 1).trim()

      sourceMapToSourceCodeDictionary[sourceMapIdentifier] = {
        ...sourceMap,
        startColumn,
        startCodeLine: startLine,
        sourceFunctionSingature,
        isSourceFunction,
        fileType,
        endColumn,
        endCodeLine: endLine,
      }
    } else {
      sourceMapToSourceCodeDictionary[sourceMapIdentifier] = {
        ...sourceMap,
        startColumn: 0,
        startCodeLine: 0,
        fileType: SourceFileType.UNKNOWN,
        endColumn: 0,
        endCodeLine: 0,
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

export const getPushLength = (opcodeByte: number): number => {
  const decimalPush1Opcode = BaseOpcodesHex.PUSH1
  const decimalPush0Opcode = BaseOpcodesHex.PUSH0
  const decimalPush32Opcode = BaseOpcodesHex.PUSH32

  if (opcodeByte >= decimalPush1Opcode && opcodeByte <= decimalPush32Opcode) {
    return opcodeByte - decimalPush0Opcode
  }

  return 0
}
