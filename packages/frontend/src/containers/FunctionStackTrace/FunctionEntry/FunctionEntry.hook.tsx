import React from 'react'
import { checkOpcodeIfOfCallGroupType, checkOpcodeIfOfCreateGroupType } from '@evm-debuger/analyzer'

import type { TNestedFunction } from '../FunctionStackTrace.types'

import type { TEntryType, TOpcodeVariants } from './FunctionEntry.types'
import { getRandomParametersColor } from './FunctionEntry.utils'

export const useFunctionVariants = (functionElement: TNestedFunction) => {
  const opCodeVariant = React.useMemo((): TOpcodeVariants => {
    if (!functionElement.function?.name) {
      return 'Missing'
    }

    if (checkOpcodeIfOfCallGroupType(functionElement.function?.op)) {
      return 'Call'
    }
    if (checkOpcodeIfOfCreateGroupType(functionElement.function?.op)) {
      return 'Create'
    }
    if (functionElement.function?.op === 'JUMPDEST') {
      return 'Jumpdest'
    }
  }, [functionElement.function])

  const entryVariant: TEntryType[] = React.useMemo(() => {
    const entryType: TEntryType[] = []
    if (functionElement.function?.isMain) {
      entryType.push('Main')
    } else {
      entryType.push('NonMain')
    }
    if (functionElement.function?.isYul) {
      entryType.push('Yul')
    }
    return entryType
  }, [functionElement.function])

  const parametersColors = React.useMemo(() => {
    return getRandomParametersColor(functionElement.function?.inputs?.length || 0)
  }, [functionElement.function?.inputs])

  return { parametersColors, opCodeVariant, entryVariant }
}
