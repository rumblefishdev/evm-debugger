import type {
  TEtherscanContractSourceCodeResult,
  TSolcConfiguration,
} from '@evm-debuger/types'

export const isSingleFile = (sourceCode: string): boolean => {
  return sourceCode.match(/"content":"/g) === null
}

export const isMultipleFilesSources = (sourceCode: string): boolean => {
  return sourceCode.match(/"sources":/g) !== null
}
export const isMultipleFilesPlain = (sourceCode: string): boolean => {
  const numberOfContents = sourceCode.match(/"content":"/g)?.length
  const hasMoreThanZeroContent =
    numberOfContents !== undefined && numberOfContents > 0

  return hasMoreThanZeroContent && !isMultipleFilesSources(sourceCode)
}

export const createBaseSettingsObject = (
  sourceData: TEtherscanContractSourceCodeResult,
): TSolcConfiguration => {
  const language = sourceData.SourceCode.includes('pragma solidity')
    ? 'Solidity'
    : 'Vyper'

  return {
    solcCompilerVersion: sourceData.CompilerVersion,
    settings: {
      optimizer: {
        runs: Number(sourceData.Runs),
        enabled: Boolean(sourceData.OptimizationUsed === '1'),
      },
    },
    rootContractName: sourceData.ContractName,
    language,
  }
}
