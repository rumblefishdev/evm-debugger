import type { TEtherscanContractSourceCodeResult, TEtherscanParsedSourceCode } from '@evm-debuger/types'

import { ensureDirectoryExistance, isMultipleFilesJSON, saveToFile } from './utils'
import { Paths } from './paths'

export const handleSingleSourceCode = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const rawSourceCode = sourceCodeData.SourceCode.replace(/(\r\n)/gm, '').slice(1, -1)
  saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceCode.json`, { sourceCode: rawSourceCode })

  saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceFile.sol`, sourceCodeData.SourceCode)

  const settings = {
    optimizer: { runs: Number(sourceCodeData.Runs), enabled: Boolean(sourceCodeData.OptimizationUsed) },
    evmVersion: sourceCodeData.CompilerVersion,
  }
  const language = rawSourceCode.includes('pragma solidity') ? 'Solidity' : 'Vyper'
  const sources = { [sourceCodeData.ContractName]: { content: sourceCodeData.SourceCode } }

  return { sources, settings, language }
}

export const handleMultipleSourceCodes = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const rawSourceCode = sourceCodeData.SourceCode.replace(/(\r\n)/gm, '').slice(1, -1)
  const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

  saveToFile(
    `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceCodes.json`,
    Object.entries(sourceCodeObj.sources).map(([path, { content }]) => ({
      path,
      content: content.replace(/\r?\n|\r/g, ' ').replace(/"/g, "'"),
    })),
  )
  Object.entries(sourceCodeObj.sources).forEach(([path, { content }]) => {
    ensureDirectoryExistance(
      `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/files/${path.slice(0, path.lastIndexOf('/'))}`,
    )
    saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/files/${path}`, content)
  })

  const settings = sourceCodeObj.settings || {
    optimizer: { runs: Number(sourceCodeData.Runs), enabled: Boolean(sourceCodeData.OptimizationUsed) },
    evmVersion: sourceCodeData.CompilerVersion,
  }

  return { sources: sourceCodeObj.sources, settings, language: sourceCodeObj.language }
}

export const handleSourceCode = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const isMultipleFiles = isMultipleFilesJSON(sourceCodeData.SourceCode)

  return isMultipleFiles
    ? handleMultipleSourceCodes(sourceCodeData, contractAddress)
    : handleSingleSourceCode(sourceCodeData, contractAddress)
}
