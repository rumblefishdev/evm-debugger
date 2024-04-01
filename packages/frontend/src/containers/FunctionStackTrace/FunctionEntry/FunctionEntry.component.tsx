import type { TFunctionEntryComponentProps } from './FunctionEntry.types'
import { FunctionEntry } from './FunctionEntry.container'
import {
  StyledFunctionEntryBody,
  StyledFunctionEntryContent,
  StyledFunctionEntryLeftWrapper,
  StyledFunctionEntryWrapper,
} from './FunctionEntry.styles'

export const FunctionEntryComponent: React.FC<TFunctionEntryComponentProps> = ({ functionElement }) => {
  return (
    <StyledFunctionEntryWrapper>
      <StyledFunctionEntryBody>
        <StyledFunctionEntryLeftWrapper>
          <div>{functionElement.function?.op}</div>
        </StyledFunctionEntryLeftWrapper>
        <StyledFunctionEntryContent sx={{ marginLeft: functionElement?.function?.depth || 0 }}>
          {functionElement.function?.contraceName}.{functionElement.function?.name}
        </StyledFunctionEntryContent>
      </StyledFunctionEntryBody>
      {functionElement.innerFunctions.map((innerFunction, index) => (
        <FunctionEntry
          key={innerFunction.function?.index || index}
          functionElement={innerFunction}
        />
      ))}
    </StyledFunctionEntryWrapper>
  )
}
