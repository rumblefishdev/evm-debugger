import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import { uiSelectors } from '../../../store/ui/ui.selectors'
import { uiActions } from '../../../store/ui/ui.slice'

import { FunctionInputParameterComponent } from './FunctionInputParameter.component'
import type { TFunctionInputParameterProps } from './FunctionInputParameter.types'
import { shortenValue } from './FunctionInputParameter.utils'

export const FunctionInputParameter: React.FC<TFunctionInputParameterProps> = ({ parameter, color, ...props }) => {
  const dispatch = useDispatch()

  const [copiedValue, setCopiedValue] = React.useState('')

  const currentFunctionParameterId = useSelector(uiSelectors.selectCurrentFunctionParameterId)
  const isTooltipOpen = currentFunctionParameterId === parameter.id

  React.useEffect(() => {
    if (copiedValue) {
      const timeout = setTimeout(() => {
        setCopiedValue('')
      }, 1500)
      return () => clearTimeout(timeout)
    }
  }, [copiedValue])

  const displayedShortValue = React.useMemo(() => {
    if (!parameter.value) {
      return 'not found'
    }

    if (parameter.isArray && typeof parameter.value === 'object') {
      const value = parameter.value as string[]
      const joinedArrayValue = `[${value.join(', ')}]`
      return shortenValue(joinedArrayValue, true)
    }

    if (typeof parameter.value === 'object' && !parameter.isArray) {
      return 'Tuple ( Not  supported )'
    }

    const value = parameter.value as string
    return shortenValue(value)
  }, [parameter.value, parameter.isArray])

  const handleTooltipOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    dispatch(uiActions.setCurrentFunctionParameterId(parameter.id))
    event.stopPropagation()
  }

  const handleTooltipClose = () => {
    dispatch(uiActions.setCurrentFunctionParameterId(null))
  }

  const handleCopy = (elementValue: string) => {
    navigator.clipboard.writeText(elementValue)
    setCopiedValue(elementValue)
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
      handleCopy={handleCopy}
      copiedValue={copiedValue}
      {...props}
    />
  )
}
