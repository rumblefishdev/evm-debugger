import type { ConversionResult, OpcodeElement, SourceMapElement } from './types'

export const convert = (sourceMap: SourceMapElement[], opcodes: OpcodeElement[]): void => {
  console.log('convertSourceMap', JSON.stringify(sourceMap, null, 2))
  console.log('opcodes', JSON.stringify(opcodes, null, 2))
}
