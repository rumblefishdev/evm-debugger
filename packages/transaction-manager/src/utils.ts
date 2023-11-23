import { existsSync, mkdir, mkdirSync, readFileSync, writeFileSync } from 'fs'

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
    console.log('Saving to file: ', absolutePath)
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

export const isMultipleFilesJSON = (sourceCode) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

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
