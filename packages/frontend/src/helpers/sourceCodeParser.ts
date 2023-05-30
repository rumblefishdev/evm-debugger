const isMultipleFilesJSON = (sourceCode) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

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
