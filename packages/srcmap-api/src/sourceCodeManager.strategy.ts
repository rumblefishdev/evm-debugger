import type {
  TEtherscanContractSourceCodeResult,
  TEtherscanParsedSourceCode,
  TExtractedSourceFiles,
  TSolcConfiguration,
} from '@evm-debuger/types'

import { createBaseSettingsObject } from './helpers'
import type { SourceCodeManager } from './types'

class MultiFileExtendedSourceManager {
  public static isApplicable(sourceCode: string): boolean {
    const matchingResult = sourceCode.match(/"sources": {/g)
    return matchingResult !== null && matchingResult.length > 0
  }
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TExtractedSourceFiles {
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
class SingleFileSourceManager {
  public static isApplicable(sourceCode: string): boolean {
    const matchingResult = sourceCode.match(/"content":/g)
    return matchingResult === null
  }

  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TExtractedSourceFiles {
    return [[sourceData.ContractName, sourceData.SourceCode]]
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TSolcConfiguration {
    return createBaseSettingsObject(sourceData)
  }
}

class MultiFileSourceManager {
  public static isApplicable(sourceCode: string): boolean {
    const matchingResult = sourceCode.match(/"content":/g)

    if (matchingResult === null) return false

    const hasMoreThanZeroContent = matchingResult.length > 0

    return (
      hasMoreThanZeroContent &&
      !MultiFileExtendedSourceManager.isApplicable(sourceCode)
    )
  }
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TExtractedSourceFiles {
    const rawSourceCode = sourceData.SourceCode.replace(/(\r\n)/gm, '')

    const sourceCodeObj: Record<string, { content: string }> =
      JSON.parse(rawSourceCode)

    return Object.keys(sourceCodeObj).map((fileName) => [
      fileName,
      sourceCodeObj[fileName].content,
    ])
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TSolcConfiguration {
    return createBaseSettingsObject(sourceData)
  }
}

export class SoruceCodeManagerStrategy {
  private sourceCodeManager: SourceCodeManager

  constructor(sourceCode: string) {
    switch (true) {
      case SingleFileSourceManager.isApplicable(sourceCode):
        this.sourceCodeManager = new SingleFileSourceManager()
        break
      case MultiFileExtendedSourceManager.isApplicable(sourceCode):
        this.sourceCodeManager = new MultiFileExtendedSourceManager()
        break
      case MultiFileSourceManager.isApplicable(sourceCode):
        this.sourceCodeManager = new MultiFileSourceManager()
        break
      default:
        throw new Error('Unknown source code structure')
    }
  }

  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TExtractedSourceFiles {
    return this.sourceCodeManager.extractFiles(sourceData)
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): object {
    return this.sourceCodeManager.createSettingsObject(sourceData)
  }
}
