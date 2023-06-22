import { Supported } from '../Supported'

import { DebuggerStack, ContentStack, StyledTitle } from './styles'

export const Debugger = () => {
  return (
    <DebuggerStack>
      <StyledTitle>Supported Chain</StyledTitle>
      <ContentStack>
        <Supported />
      </ContentStack>
    </DebuggerStack>
  )
}
