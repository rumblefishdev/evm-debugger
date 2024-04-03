import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { uiSelectors } from '../../../store/ui/ui.selectors'
import { uiActions } from '../../../store/ui/ui.slice'

import { FunctionInputParameterComponent } from './FunctionInputParameter.component'
import type { TFunctionInputParameterProps } from './FunctionInputParameter.types'

export const FunctionInputParameter: React.FC<TFunctionInputParameterProps> = ({ parameter, color, ...props }) => {
  const dispatch = useDispatch()

  const currentFunctionParameterId = useSelector(uiSelectors.selectCurrentFunctionParameterId)
  const isTooltipOpen = currentFunctionParameterId === parameter.id

  const displayedShortValue = React.useMemo(() => {
    if (parameter.isArray) {
      const value = parameter.value as string[]
      const joinedArrayValue = `[${value.join(', ')}]`
      return joinedArrayValue.length > 20 ? `${joinedArrayValue.slice(0, 20)}...` : joinedArrayValue
    }
    const value = parameter.value as string
    return value.length > 20 ? `${value.slice(0, 20)}...` : value
  }, [parameter.value, parameter.isArray])

  const handleTooltipOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(uiActions.setCurrentFunctionParameterId(parameter.id))
    event.stopPropagation()
  }

  const handleTooltipClose = () => {
    dispatch(uiActions.setCurrentFunctionParameterId(null))
  }

  return (
    <FunctionInputParameterComponent
      isTooltipOpen={isTooltipOpen}
      name={parameter.name}
      type={parameter.type}
      value={parameter.value}
      shortValue={displayedShortValue}
      color={color}
      handleTooltipClose={handleTooltipClose}
      handleTooltipOpen={handleTooltipOpen}
      {...props}
    />
  )
}
