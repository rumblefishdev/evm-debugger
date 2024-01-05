/* eslint-disable sonarjs/no-identical-functions */
import type {
  TEtherscanContractSourceCodeResult,
  TEtherscanParsedSourceCode,
  TSolcConfiguration,
} from '@evm-debuger/types'

interface SourceCodeManager {
  extractFiles: (
    sourceData: TEtherscanContractSourceCodeResult,
  ) => [string, string][]
  createSettingsObject: (
    sourceData: TEtherscanContractSourceCodeResult,
  ) => TSolcConfiguration
}

const isSingleFile = (sourceCode: string): boolean => {
  return sourceCode.match(/"content":"/g) === null
}

const isMultipleFilesSources = (sourceCode: string): boolean => {
  return sourceCode.match(/"sources":/g) !== null
}
const isMultipleFilesPlain = (sourceCode: string): boolean => {
  const numberOfContents = sourceCode.match(/"content":"/g)?.length
  const hasMoreThanZeroContent =
    numberOfContents !== undefined && numberOfContents > 0

  return hasMoreThanZeroContent && !isMultipleFilesSources(sourceCode)
}

class SingleFileSourceManager {
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): [string, string][] {
    return [[sourceData.ContractName, sourceData.SourceCode]]
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TSolcConfiguration {
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
      language,
    }
  }
}
class MultiFileSourceManager {
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): [string, string][] {
    const rawSourceCode = sourceData.SourceCode.replace(/(\r\n)/gm, '')

    const sourceCodeObj: Record<string, string> = JSON.parse(rawSourceCode)

    return Object.keys(sourceCodeObj).map((fileName) => [
      fileName,
      sourceCodeObj[fileName],
    ])
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TSolcConfiguration {
    const rawSourceCode = sourceData.SourceCode.replace(/(\r\n)/gm, '').slice(
      1,
      -1,
    )
    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    const { sources, ...sourceCodeSettings } = sourceCodeObj

    return {
      ...sourceCodeSettings,
      solcCompilerVersion: sourceData.CompilerVersion,
    }
  }
}
class MultiFileExtendedSourceManager {
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): [string, string][] {
    const rawSourceCode = sourceData.SourceCode.replace(/(\r\n)/gm, '').slice(
      1,
      -1,
    )

    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    return Object.keys(sourceCodeObj.sources).map((fileName) => [
      fileName,
      sourceCodeObj.sources[fileName].content,
    ])
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TSolcConfiguration {
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
      language,
    }
  }
}

export class SoruceCodeManagerStrategy {
  private sourceCodeManager: SourceCodeManager

  constructor(sourceCode: string) {
    switch (true) {
      case isSingleFile(sourceCode):
        this.sourceCodeManager = new SingleFileSourceManager()
        break
      case isMultipleFilesSources(sourceCode):
        this.sourceCodeManager = new MultiFileSourceManager()
        break
      case isMultipleFilesPlain(sourceCode):
        this.sourceCodeManager = new MultiFileExtendedSourceManager()
        break
      default:
        throw new Error('Unknown source code structure')
    }
  }

  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): [string, string][] {
    return this.sourceCodeManager.extractFiles(sourceData)
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): object {
    return this.sourceCodeManager.createSettingsObject(sourceData)
  }
}
