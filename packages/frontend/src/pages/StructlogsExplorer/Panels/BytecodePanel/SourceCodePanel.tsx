import { StyledHeading, StyledSmallPanel, StyledButton } from '../styles'

import { SourceCodeDebugger } from './SourceCodeDebugger'

export type SourceCodePanelProps = {
  close: () => void
  sourceCode?: string
}

export const SourceCodePanel = ({ close, sourceCode }: SourceCodePanelProps): JSX.Element => {
  return (
    <StyledSmallPanel
      style={{
        marginBottom: '2rem',
        height: 'calc(50vh - 3rem)',
        gridRow: 1,
        gridColumn: 'span 3',
      }}
    >
      <StyledHeading>
        Source Code
        <StyledButton
          variant="text"
          onClick={close}
        >
          View bytecode
        </StyledButton>
      </StyledHeading>
      <SourceCodeDebugger source={sourceCode} />
    </StyledSmallPanel>
  )
}
