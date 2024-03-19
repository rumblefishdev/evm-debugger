import type { TContractSourceFiles, TSourceFile } from '@evm-debuger/types'
import { v4 as createUUID } from 'uuid'

export const createMockedSourceFiles = (): TContractSourceFiles => {
  const address = createUUID()
  const sourceFiles1: TSourceFile = { path: 'path1', name: 'name1', content: 'content1' }
  const sourceFiles2: TSourceFile = { path: 'path2', name: 'name2', content: 'content2' }

  return { sourceFiles: [sourceFiles1, sourceFiles2], address }
}
