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
    console.log('matchingResult', matchingResult)
    console.log('matchingResult !== null', matchingResult !== null)
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
    console.log('matchingResult', matchingResult)
    console.log('matchingResult === null', matchingResult === null)
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

    console.log('matchingResult', matchingResult)

    if (matchingResult === null) return false
    console.log('matchingResult.length > 0', matchingResult.length > 0)

    const hasMoreThanZeroContent = matchingResult.length > 0

    console.log(
      '!MultiFileExtendedSourceManager.isApplicable(sourceCode)',
      !MultiFileExtendedSourceManager.isApplicable(sourceCode),
    )

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

    console.log('sourceCodeObj', sourceCodeObj)

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
    console.log('sourceCode', sourceCode)
    console.log('typeof sourceCode', typeof sourceCode)

    switch (true) {
      case SingleFileSourceManager.isApplicable(sourceCode):
        console.log('SingleFileSourceManager')
        this.sourceCodeManager = new SingleFileSourceManager()
        break
      case MultiFileExtendedSourceManager.isApplicable(sourceCode):
        console.log('MultiFileExtendedSourceManager')
        this.sourceCodeManager = new MultiFileExtendedSourceManager()
        break
      case MultiFileSourceManager.isApplicable(sourceCode):
        console.log('MultiFileSourceManager')
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
