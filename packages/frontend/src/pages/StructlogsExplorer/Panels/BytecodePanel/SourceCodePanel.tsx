import { StyledHeading, StyledSmallPanel } from '../styles'

import { StyledButton } from './styles'
import { SourceCodeDebugger } from './SourceCodeDebugger'

export type SourceCodePanelProps = {
  close: () => void
  sourceCode?: string
}

export const SourceCodePanel = ({
  close,
  sourceCode,
}: SourceCodePanelProps): JSX.Element => {
  return (
    <StyledSmallPanel>
      <StyledHeading>
        Source Code
        <StyledButton variant="text" onClick={close}>
          View bytecode
        </StyledButton>
      </StyledHeading>
      <SourceCodeDebugger source={sourceCode} />
    </StyledSmallPanel>
  )
}
