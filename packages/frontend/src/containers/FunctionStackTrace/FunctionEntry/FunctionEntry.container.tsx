import { useSelector } from 'react-redux'
import React from 'react'

import { uiSelectors } from '../../../store/ui/ui.selectors'

import { FunctionEntryComponent } from './FunctionEntry.component'
import type { TFunctionEntryContainerProps } from './FunctionEntry.types'

export const FunctionEntry: React.FC<TFunctionEntryContainerProps> = ({ functionElement, activateFunction }) => {
  const shouldDisplayYulFunction = useSelector(uiSelectors.selectDisplayYulFunctions)
  const shouldDisplaySolcMiddlewares = useSelector(uiSelectors.selectDisplaySolcMiddlewares)

  const canBeExpanded = React.useMemo(
    () =>
      functionElement.innerFunctions.filter(
        (innerFunction) =>
          (!innerFunction.function?.isMain && shouldDisplaySolcMiddlewares) ||
          (innerFunction.function?.isYul && shouldDisplayYulFunction) ||
          (innerFunction.function?.isMain && !innerFunction.function?.isYul),
      ).length > 0,
    [functionElement.innerFunctions, shouldDisplaySolcMiddlewares, shouldDisplayYulFunction],
  )

  if (functionElement.function?.isYul && !shouldDisplayYulFunction) {
    return null
  }

  if (!functionElement.function?.isMain && !shouldDisplaySolcMiddlewares) {
    return null
  }

  return (
    <FunctionEntryComponent
      canBeExpanded={canBeExpanded}
      functionElement={functionElement}
      activateFunction={activateFunction}
    />
  )
}
