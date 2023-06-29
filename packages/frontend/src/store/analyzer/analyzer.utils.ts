// Copied from hardhat source packages/hardhat-core/src/internal/hardhat-network/stack-traces/source-maps.ts

import type { SourceMap } from './analyzer.types'
import { JumpType } from './analyzer.types'

const jumpLetterToJumpType = (letter: string): JumpType => {
  if (letter === 'i') return JumpType.INTO_FUNCTION

  if (letter === 'o') return JumpType.OUTOF_FUNCTION

  return JumpType.NOT_JUMP
}

export const uncompressSourcemaps = (compressedSourcemap: string): SourceMap[] => {
  const mappings: SourceMap[] = []

  const compressedMappings = compressedSourcemap.split(';')

  for (const [index, compressedMapping] of compressedMappings.entries()) {
    const parts = compressedMapping.split(':')

    // eslint-disable-next-line no-undefined
    const hasParts0 = parts[0] !== undefined && parts[0] !== ''
    // eslint-disable-next-line no-undefined
    const hasParts1 = parts[1] !== undefined && parts[1] !== ''
    // eslint-disable-next-line no-undefined
    const hasParts2 = parts[2] !== undefined && parts[2] !== ''
    // eslint-disable-next-line no-undefined
    const hasParts3 = parts[3] !== undefined && parts[3] !== ''

    const hasEveryPart = hasParts0 && hasParts1 && hasParts2 && hasParts3

    // See: https://github.com/nomiclabs/hardhat/issues/593
    if (index === 0 && !hasEveryPart) {
      mappings.push({
        location: {
          offset: 0,
          length: 0,
          file: -1,
        },
        jumpType: JumpType.NOT_JUMP,
      })

      continue
    }

    mappings.push({
      location: {
        offset: hasParts0 ? Number(parts[0]) : mappings[index - 1].location.offset,
        length: hasParts1 ? Number(parts[1]) : mappings[index - 1].location.length,
        file: hasParts2 ? Number(parts[2]) : mappings[index - 1].location.file,
      },
      jumpType: hasParts3 ? jumpLetterToJumpType(parts[3]) : mappings[index - 1].jumpType,
    })
  }

  return mappings
}
