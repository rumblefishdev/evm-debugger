import type { TInputSources, TSourceCodeObject } from '@evm-debuger/types'

const isSingleFile = (sourceCode: string) => sourceCode.match(/"content":/g) === null
const isMultiFileExtended = (sourceCode: string) => sourceCode.match(/"sources": {/g)?.length > 0
const isMultiFile = (sourceCode: string) => sourceCode.match(/"content":/g)?.length > 0 && !isMultiFileExtended(sourceCode)

export const parseSourceCode = (sourceName: string, sourceCode: string) => {
  switch (true) {
    case isSingleFile(sourceCode):
      return { [sourceName]: sourceCode }
    case isMultiFile(sourceCode): {
      const contractsInfo = JSON.parse(sourceCode) as TInputSources

      return Object.fromEntries(
        Object.entries(contractsInfo).map(([contractName, contractDetails]) => {
          return [contractName, contractDetails.content]
        }),
      )
    }
    case isMultiFileExtended(sourceCode): {
      const contractsInfo = JSON.parse(sourceCode.slice(1, -1)) as TSourceCodeObject

      return Object.fromEntries(
        Object.entries(contractsInfo.sources).map(([contractName, contractDetails]) => {
          return [contractName, contractDetails.content]
        }),
      )
    }
    default:
      return { [sourceName]: '' }
  }
}
