import { FormControlLabel, Switch } from '@mui/material'

import {
  StyledButtonsWrapper,
  StyledFunctionStackTraceContainer,
  StyledHeading,
  StyledHeadingWrapper,
  StyledListWrapper,
} from './FunctionStackTrace.styles'
import type { TFunctionStackTraceComponentProps } from './FunctionStackTrace.types'
import { FunctionEntry } from './FunctionEntry/FunctionEntry.container'

export const FunctionStackTraceComponent: React.FC<TFunctionStackTraceComponentProps> = ({
  isNonMainFunctionsVisible,
  isYulFunctionsVisible,
  toggleMainFunctions,
  toggleYulFunctions,
  activateFunction,
  functionStack,
}) => {
  return (
    <StyledFunctionStackTraceContainer>
      <StyledHeadingWrapper>
        <StyledHeading>Function Stack Trace</StyledHeading>
        <StyledButtonsWrapper>
          <FormControlLabel
            control={
              <Switch
                disableTouchRipple
                value={isYulFunctionsVisible}
                checked={isYulFunctionsVisible}
                onChange={toggleYulFunctions}
              />
            }
            label="Show Yul functions"
          />
          <FormControlLabel
            control={
              <Switch
                disableTouchRipple
                value={isNonMainFunctionsVisible}
                checked={isNonMainFunctionsVisible}
                onChange={toggleMainFunctions}
              />
            }
            label="Show Non Main functions"
          />
        </StyledButtonsWrapper>
      </StyledHeadingWrapper>
      <StyledListWrapper>
        <FunctionEntry
          functionElement={functionStack}
          activateFunction={activateFunction}
        />
      </StyledListWrapper>
    </StyledFunctionStackTraceContainer>
  )
}
