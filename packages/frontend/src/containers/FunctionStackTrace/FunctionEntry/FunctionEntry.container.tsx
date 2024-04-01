import { useSelector } from 'react-redux'

import { uiSelectors } from '../../../store/ui/ui.selectors'

import { FunctionEntryComponent } from './FunctionEntry.component'
import type { TFunctionEntryContainerProps } from './FunctionEntry.types'

export const FunctionEntry: React.FC<TFunctionEntryContainerProps> = ({ functionElement }) => {
  const shouldDisplayYulFunction = useSelector(uiSelectors.selectDisplayYulFunctions)
  const shouldDisplayMainFunction = useSelector(uiSelectors.selectDisplayMainFunctions)

  if (functionElement.function?.isYul && !shouldDisplayYulFunction) {
    return null
  }

  if (!functionElement.function?.isMain && !shouldDisplayMainFunction) {
    return null
  }

  return <FunctionEntryComponent functionElement={functionElement} />
}
