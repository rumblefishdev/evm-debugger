/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-undefined */
import type { SourceMapElement } from './types'

export const converSourceMap = (sourceMap: string): SourceMapElement[] => {
  const sourceMapArray: string[] = sourceMap.split(';')
  const convertedSourceMap: SourceMapElement[] = []

  //   console.log('sourceMapArray', JSON.stringify(sourceMapArray, null, 2))

  for (let index = 0; index < sourceMapArray.length; index++) {
    const element: string = sourceMapArray[index]
    const [start, length, fileId, jump] = element.split(':')

    const hasStart = start !== undefined && start !== ''
    const hasLength = length !== undefined && length !== ''
    const hasFileId = fileId !== undefined && fileId !== ''
    const hasJump = jump !== undefined && jump !== ''

    const hasEveryPart = hasStart && hasLength && hasFileId && hasJump

    if (hasEveryPart) {
      convertedSourceMap.push({
        start: parseInt(start, 10),
        length: parseInt(length, 10),
        jump,
        fileId: parseInt(fileId, 10),
      })
    }

    if (!hasEveryPart) {
      convertedSourceMap.push({
        start: hasStart ? parseInt(start, 10) : convertedSourceMap[index - 1].start,
        length: hasLength ? parseInt(length, 10) : convertedSourceMap[index - 1].length,
        jump: hasJump ? jump : convertedSourceMap[index - 1].jump,
        fileId: hasFileId ? parseInt(fileId, 10) : convertedSourceMap[index - 1].fileId,
      })
    }

    if (index === 0 && !hasEveryPart) {
      convertedSourceMap.push({
        start: 0,
        length: 0,
        jump: '-',
        fileId: 0,
      })
    }
  }

  return convertedSourceMap
}
