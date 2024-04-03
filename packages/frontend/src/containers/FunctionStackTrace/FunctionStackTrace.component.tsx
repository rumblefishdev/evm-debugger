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
  isSolcMiddlewaresVisible,
  toggleSolcMiddlewares,
  isYulFunctionsVisible,
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
                value={isSolcMiddlewaresVisible}
                checked={isSolcMiddlewaresVisible}
                onChange={toggleSolcMiddlewares}
              />
            }
            label="Show Solc Middlewares"
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
