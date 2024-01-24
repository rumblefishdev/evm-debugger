/* eslint-disable sort-keys-fix/sort-keys-fix */
import type { TEtherscanContractSourceCodeResult, TEtherscanParsedSourceCode } from '@evm-debuger/types'

import { ensureDirectoryExistance, isMultipleFilesJSON, saveToFile } from './utils'
import { Paths } from './paths'

export const handleSingleSourceCode = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const rawSourceCode = sourceCodeData.SourceCode.replace(/(\r\n)/gm, '')
  saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceCode.json`, { sourceCode: rawSourceCode })

  saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceFile.sol`, sourceCodeData.SourceCode)

  const settings = {
    optimizer: { enabled: Boolean(sourceCodeData.OptimizationUsed === '1'), runs: Number(sourceCodeData.Runs) },
    // evmVersion: sourceCodeData.EVMVersion.toLocaleLowerCase() === 'default' ? 'istanbul' : sourceCodeData.EVMVersion.toLocaleLowerCase(),
  }
  const language = sourceCodeData.SourceCode.includes('pragma solidity') ? 'Solidity' : 'Vyper'
  const sources = {
    [`sourceFile.sol`]: { content: sourceCodeData.SourceCode.replace(/"/g, "'") },
  }

  return { sources, settings, language }
}

export const handleMultipleSourceCodes = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const rawSourceCode = sourceCodeData.SourceCode.replace(/(\r\n)/gm, '')
    .replace(/^\uFEFF/gm, '')
    .replace(/^\u00BB\u00BF/gm, '')
  // .slice(1, -1)
  const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

  // console.log(`Source code object: ${JSON.stringify(sourceCodeObj, null, 2)}`)

  saveToFile(
    `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/sourceCodes.json`,
    Object.entries(sourceCodeObj?.sources || sourceCodeObj).map(([path, { content }]) => {
      return { path, content: content.replace(/\r?\n|\r/g, ' ').replace(/"/g, "'") }
    }),
  )

  Object.entries(sourceCodeObj?.sources || sourceCodeObj).forEach(([path, { content }]) => {
    ensureDirectoryExistance(
      `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/files/${path.slice(0, path.lastIndexOf('/'))}`,
    )
    saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${contractAddress}/files/${path}`, content)
  })

  const settings = sourceCodeObj.settings || {
    optimizer: { runs: Number(sourceCodeData.Runs), enabled: Boolean(sourceCodeData.OptimizationUsed) },
    evmVersion: sourceCodeData.EVMVersion.toLocaleLowerCase() === 'default' ? 'istanbul' : sourceCodeData.EVMVersion.toLocaleLowerCase(),
  }

  const language = sourceCodeData.SourceCode.includes('pragma solidity') ? 'Solidity' : 'Vyper'

  return { sources: sourceCodeObj?.sources || sourceCodeObj, settings, language: sourceCodeObj.language || language }
}

export const handleSourceCode = (
  sourceCodeData: TEtherscanContractSourceCodeResult,
  contractAddress: string,
): TEtherscanParsedSourceCode => {
  const isMultipleFiles = isMultipleFilesJSON(sourceCodeData.SourceCode)

  console.log(`Is multiple files: ${isMultipleFiles}`)

  return isMultipleFiles
    ? handleMultipleSourceCodes(sourceCodeData, contractAddress)
    : handleSingleSourceCode(sourceCodeData, contractAddress)
}
