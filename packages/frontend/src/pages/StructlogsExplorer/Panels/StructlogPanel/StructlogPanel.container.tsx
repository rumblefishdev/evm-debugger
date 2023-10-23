import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'

import { StructlogPanelComponent } from './StructlogPanel.component'

export const StructlogPanel: React.FC = () => {
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeIndex = useSelector(activeStructLogSelectors.selectIndex)
  const currentInstructions = useSelector(instructionsSelectors.selectCurrentInstructions)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      if (event.key === 'ArrowDown' && !event.repeat) {
        event.preventDefault()
        dispatch(activeStructLogActions.setNextStructLogAsActive(structLogs))
      }
      if (event.key === 'ArrowUp' && !event.repeat) {
        event.preventDefault()
        dispatch(activeStructLogActions.setPreviousStructLogAsActive(structLogs))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [structLogs, dispatch])

  const handleSelect = (index: number) => {
    dispatch(activeStructLogActions.setActiveStrucLog(index))
    dispatch(activeSourceFileActions.setActiveSourceFile(currentInstructions[structLogs[index].pc].fileId))
  }

  return (
    <StructlogPanelComponent
      structlogs={structLogs}
      activeStructlogIndex={activeIndex}
      handleSelect={handleSelect}
    />
  )
}
