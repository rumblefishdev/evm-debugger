import type {
  TEtherscanContractSourceCodeResult,
  TEtherscanParsedSourceCode,
  TExtractedSourceFiles,
  TSolcConfiguration,
} from '@evm-debuger/types'

import {
  createBaseSettingsObject,
  isMultipleFilesPlain,
  isMultipleFilesSources,
  isSingleFile,
} from './helpers'
import type { SourceCodeManager } from './types'

class SingleFileSourceManager {
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
  public extractFiles(
    sourceData: TEtherscanContractSourceCodeResult,
  ): TExtractedSourceFiles {
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
    return createBaseSettingsObject(sourceData)
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
  ): TExtractedSourceFiles {
    return this.sourceCodeManager.extractFiles(sourceData)
  }

  public createSettingsObject(
    sourceData: TEtherscanContractSourceCodeResult,
  ): object {
    return this.sourceCodeManager.createSettingsObject(sourceData)
  }
}
