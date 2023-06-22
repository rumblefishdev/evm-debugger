import { Supported } from '../Supported'

import { DebuggerStack, ContentStack } from './styles'

export const Debugger = () => {
  return (
    <DebuggerStack>
      <ContentStack>
        <Supported />
      </ContentStack>
    </DebuggerStack>
  )
}
