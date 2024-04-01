import { useSelector } from 'react-redux'

import { uiSelectors } from '../../../store/ui/ui.selectors'

import { FunctionEntryComponent } from './FunctionEntry.component'
import type { TFunctionEntryContainerProps } from './FunctionEntry.types'

export const FunctionEntry: React.FC<TFunctionEntryContainerProps> = ({ functionElement }) => {
  const shouldDisplayYulFunction = useSelector(uiSelectors.selectDisplayYulFunctions)
  const shouldDisplayNonMainFunction = useSelector(uiSelectors.selectDisplayNonMainFunctions)

  if (functionElement.function?.isYul && !shouldDisplayYulFunction) {
    return null
  }

  if (!functionElement.function?.isMain && !shouldDisplayNonMainFunction) {
    return null
  }

  const canBeExpanded =
    functionElement.innerFunctions.filter(
      (innerFunction) =>
        (!innerFunction.function?.isMain && shouldDisplayNonMainFunction) ||
        (innerFunction.function?.isYul && shouldDisplayYulFunction) ||
        (innerFunction.function?.isMain && !innerFunction.function?.isYul),
    ).length > 0

  return (
    <FunctionEntryComponent
      canBeExpanded={canBeExpanded}
      functionElement={functionElement}
    />
  )
}
