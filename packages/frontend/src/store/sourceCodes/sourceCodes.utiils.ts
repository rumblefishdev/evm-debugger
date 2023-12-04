import type { TParseSourceCodeOutput } from '@evm-debuger/types'
import { SrcMapStatus } from '@evm-debuger/types'

import { parseSourceCode } from '../../helpers/sourceCodeParser'

import type { TSourceCodes } from './sourceCodes.types'

export const convertAddressesToStatuses = (addresses: string[]): Record<string, SrcMapStatus> =>
  addresses.reduce((accumulator, address) => {
    accumulator[address] = SrcMapStatus.PENDING
    return accumulator
  }, {})

export const createSources = (
  sourcesOrder: Record<number, string>,
  parseSourceCodeResult: Record<string, string>,
): TParseSourceCodeOutput => {
  return Object.entries(sourcesOrder)
    .map(([_, name]) => {
      return [name, parseSourceCodeResult[name] || '']
    })
    .reduce((accumulator, [name, content], index) => {
      accumulator[index] = { sourceName: name, content }
      return accumulator
    }, {})
}

export const mapSourceCode = ({ contractName, sourceCode, sourcesOrder, address }: TSourceCodes & { contractName: string | null }) => {
  const parseSourceCodeResult = parseSourceCode(contractName, sourceCode || '')
  const sources = createSources(sourcesOrder, parseSourceCodeResult)
  return { sources, address }
}

export const reduceToAddressSources = (accumulator: unknown, { sources, address }: { sources: unknown, address: unknown }) => {
  accumulator[address] = sources
  return accumulator
}
