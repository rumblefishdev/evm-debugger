import React from 'react'

import { parseSourceCode } from '../helpers/sourceCodeParser'

export function useSources(contractName: string, sourceCode?: string) {
  return React.useMemo(() => (sourceCode ? parseSourceCode(contractName, sourceCode) : {}), [contractName, sourceCode])
}
