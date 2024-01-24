import { existsSync, mkdir, mkdirSync, readFileSync, writeFileSync } from 'fs'

import type { TEtherscanContractSourceCodeResult, TSolcConfiguration } from '@evm-debuger/types'

type TParsedEnum = { value: number; name: string }
export const mapEnumToObject = (enumObject: Record<string, number | string>): TParsedEnum[] => {
  const parsedObject: TParsedEnum[] = []

  Object.entries(enumObject).forEach(([key, value]) => {
    const isValue = typeof value === 'number'
    if (isValue) {
      parsedObject.push({ value, name: key })
    }
  })

  return parsedObject
}

export const TRANSACTION_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/

export const isValidTransaction = (transactionHash: string): boolean => {
  return TRANSACTION_HASH_REGEX.test(transactionHash)
}

export const ensureDirectoryExistance = (path: string) => {
  const absolutePath = `${process.cwd()}/${path}`

  const isDirectoryExists = existsSync(absolutePath)

  if (!isDirectoryExists) {
    mkdirSync(path, { recursive: true })
  }
}

export const saveToFile = (path: string, data: object | string) => {
  const absolutePath = `${process.cwd()}/${path}`

  if (typeof data === 'string') {
    writeFileSync(absolutePath, data)
  } else {
    writeFileSync(absolutePath, JSON.stringify(data, null, 2))
  }
}

export const checkIfPathExists = (path: string): boolean => {
  const absolutePath = `${process.cwd()}/${path}`

  return existsSync(absolutePath)
}

export const readFromFile = <T>(path: string): T => {
  const absolutePath = `${process.cwd()}/${path}`

  const rawFileData: string = readFileSync(absolutePath, 'utf8')

  return JSON.parse(rawFileData)
}

export const isMultipleFilesJSON = (sourceCode: string) => {
  // if has multiple \"content\":\" fields - it's a multiple files JSON
  return sourceCode.match(/"content":"/g)?.length >= 1
}

export const parseSourceCode = (sourceName: string, sourceCode: string) => {
  if (isMultipleFilesJSON(sourceCode)) {
    const contractsInfo = JSON.parse(sourceCode.slice(1, -1).replace(/(\r\n)/gm, '')) as {
      sources: Record<string, { content: string }>
    }

    return Object.fromEntries(
      Object.entries(contractsInfo.sources).map(([contractName, contractDetails]) => {
        return [contractName, contractDetails.content]
      }),
    )
  }
  return { [sourceName]: sourceCode }
}

export const createBaseSettingsObject = (sourceData: TEtherscanContractSourceCodeResult): TSolcConfiguration => {
  const language = sourceData.SourceCode.includes('pragma solidity') ? 'Solidity' : 'Vyper'

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
