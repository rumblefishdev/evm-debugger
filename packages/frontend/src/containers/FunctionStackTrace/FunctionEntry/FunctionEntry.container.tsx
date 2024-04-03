import { useSelector } from 'react-redux'
import React from 'react'

import { uiSelectors } from '../../../store/ui/ui.selectors'

import { FunctionEntryComponent } from './FunctionEntry.component'
import type { TFunctionEntryContainerProps } from './FunctionEntry.types'

export const FunctionEntry: React.FC<TFunctionEntryContainerProps> = ({ functionElement, activateFunction }) => {
  const shouldDisplayYulFunction = useSelector(uiSelectors.selectDisplayYulFunctions)
  const shouldDisplayNonMainFunction = useSelector(uiSelectors.selectDisplayNonMainFunctions)

  const canBeExpanded = React.useMemo(
    () =>
      functionElement.innerFunctions.filter(
        (innerFunction) =>
          (!innerFunction.function?.isMain && shouldDisplayNonMainFunction) ||
          (innerFunction.function?.isYul && shouldDisplayYulFunction) ||
          (innerFunction.function?.isMain && !innerFunction.function?.isYul),
      ).length > 0,
    [functionElement.innerFunctions, shouldDisplayNonMainFunction, shouldDisplayYulFunction],
  )

  if (functionElement.function?.isYul && !shouldDisplayYulFunction) {
    return null
  }

  if (!functionElement.function?.isMain && !shouldDisplayNonMainFunction) {
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
