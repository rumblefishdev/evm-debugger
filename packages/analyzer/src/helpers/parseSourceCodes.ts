import path from 'path'

import type { TInputSources, TSourceCodeObject, TSourceFile } from '@evm-debuger/types'

const isSingleFile = (sourceCode: string) => sourceCode.match(/"content":/g) === null
const isMultiFileExtended = (sourceCode: string) => sourceCode.match(/"sources": {/g)?.length > 0
const isMultiFile = (sourceCode: string) => sourceCode.match(/"content":/g)?.length > 0 && !isMultiFileExtended(sourceCode)

export const parseSourceCode = (sourceName: string, sourceCode: string, yulSource?: string): Record<string, TSourceFile> => {
  switch (true) {
    case isSingleFile(sourceCode): {
      const mainFile: Record<string, TSourceFile> = { [sourceName]: { path: sourceName, name: sourceName, content: sourceCode } }
      const utilityFile: Record<string, TSourceFile> = {
        'utility.yul': { path: 'utility.yul', name: 'utility.yul', content: yulSource || '' },
      }

      return { ...mainFile, ...(yulSource ? utilityFile : {}) }
    }
    case isMultiFile(sourceCode): {
      const contractsInfo = JSON.parse(sourceCode) as TInputSources
      contractsInfo['utility.yul'] = { content: yulSource }

      return Object.entries(contractsInfo.sources).reduce<Record<string, TSourceFile>>((accumulator, [contractPath, contractContent]) => {
        accumulator[contractPath] = {
          path: contractPath,
          name: contractPath.split('/').pop().split('.').shift(),
          content: contractContent,
        }
        return accumulator
      }, {})
    }
    case isMultiFileExtended(sourceCode): {
      const contractsInfo = JSON.parse(sourceCode.slice(1, -1)) as TSourceCodeObject
      contractsInfo['sources']['utility.yul'] = { content: yulSource }

      return Object.entries(contractsInfo.sources).reduce<Record<string, TSourceFile>>((accumulator, [contractPath, contractDetails]) => {
        accumulator[contractPath] = {
          path: contractPath,
          name: contractPath.split('/').pop().split('.').shift(),
          content: contractDetails.content,
        }
        return accumulator
      }, {})
    }
    default:
      return { [sourceName]: { path: '', name: sourceName, content: '' } }
  }
}
