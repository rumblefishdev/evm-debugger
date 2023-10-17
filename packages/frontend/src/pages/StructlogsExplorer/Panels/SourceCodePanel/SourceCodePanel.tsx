import { StyledHeading, StyledButton } from '../styles'

import { SourceCodeDebuggerContainer } from './SourceCodeDebugger/SourceCodeDebugger.container'
import { StyledSourceCodePanel } from './SourceCodePanel.styles'
import type { ISourceCodePanelProps } from './SourceCodePanel.types'

export const SourceCodePanel: React.FC<ISourceCodePanelProps> = ({ close }) => {
  return (
    <StyledSourceCodePanel>
      <StyledHeading>
        Source Code
        <StyledButton
          variant="text"
          onClick={close}
        >
          View bytecode
        </StyledButton>
      </StyledHeading>
      <SourceCodeDebuggerContainer />
    </StyledSourceCodePanel>
  )
}
