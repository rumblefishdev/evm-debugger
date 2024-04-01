import { Stack } from '@mui/material'

import type { TFunctionElementComponentProps } from './FunctionElement.types'
import {
  StyledChip,
  StyledChipOptions,
  StyledFailureIcon,
  StyledFunctionSignature,
  StyledInnerFunctionSignature,
  TraceLogElementContainer,
} from './FunctionElement.styles'

export const FunctionElementComponent: React.FC<TFunctionElementComponentProps> = ({
  activateStructLog,
  activateTraceLog,
  isActiveElement,
  isActiveGroup,
  functionBody,
}) => {
  return (
    <TraceLogElementContainer
      marginLeft={functionBody.depth}
      onClick={() => {
        activateTraceLog(functionBody.traceLogIndex)
        if (functionBody.index !== functionBody.traceLogIndex) {
          activateStructLog(functionBody.index)
        }
      }}
    >
      <StyledChip
        isRevertd={functionBody.isReverted}
        size="small"
        label={functionBody.isReverted ? `Reverted! ${functionBody.op}` : functionBody.op}
      />
      <StyledChip
        isRevertd={functionBody.isReverted}
        size="small"
        label={functionBody.contraceName}
      />
      {!functionBody.isMain && (
        <StyledInnerFunctionSignature
          isActiveGroup={isActiveGroup}
          isActiveElement={isActiveElement}
        >{`${functionBody.selector}`}</StyledInnerFunctionSignature>
      )}
      {functionBody.isMain && (
        <StyledInnerFunctionSignature
          isActiveGroup={isActiveGroup}
          isActiveElement={isActiveElement}
        >{`${functionBody.contraceName}.${functionBody.name}(${functionBody.inputs
          .map((input) => `${input.name} = ${input.value}`)
          .join(', ')})`}</StyledInnerFunctionSignature>
      )}
    </TraceLogElementContainer>
  )
}
