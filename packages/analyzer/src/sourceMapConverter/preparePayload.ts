import { readFileSync } from 'fs'

import type { JsonContent, Payload, Source } from './types'

export const isMultipleFilesJSON = (sourceCode: string) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

export const parseSourceCode = (sourceName: string, sourceCode: string) => {
  if (isMultipleFilesJSON(sourceCode)) {
    const contractsInfo = JSON.parse(sourceCode.slice(1, -1)) as {
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

export const preparePayload = (): Payload => {
  const loadedPayload: JsonContent = JSON.parse(readFileSync(`${__dirname}/payload.json`, 'utf8'))

  const payload: Payload = {}

  Object.entries(loadedPayload.sourceCodes).forEach(([address, sourceCodeRaw]) => {
    const sourceCodeParsed = parseSourceCode(address, sourceCodeRaw)

    const sources: Record<string, Source> = {}

    Object.entries(sourceCodeParsed).forEach(([sourceName, sourceCode]) => {
      const sourceMap = loadedPayload.sourceMaps[address].find((sourceMapItem) => sourceName.includes(sourceMapItem.fileName))
      sources[sourceName] = {
        sourceMap: sourceMap.deployedBytecode.sourceMap,
        sourceCodeRaw: sourceCode,
        sourceCodeParsed: sourceCode,
        opcodes: sourceMap.deployedBytecode.opcodes,
        bytecode: sourceMap.deployedBytecode.object,
      }
    })

    payload[address] = {
      sources,
      combinedRawSourceCode: sourceCodeRaw,
      address,
    }
  })
  return payload
}
