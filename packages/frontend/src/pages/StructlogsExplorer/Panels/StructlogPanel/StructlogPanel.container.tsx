import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { structlogsSelectors } from '../../../../store/structlogs/structlogs.selectors'
import { activeStructLogSelectors } from '../../../../store/activeStructLog/activeStructLog.selectors'
import { instructionsSelectors } from '../../../../store/instructions/instructions.selectors'
import { activeStructLogActions } from '../../../../store/activeStructLog/activeStructLog.slice'
import { activeSourceFileActions } from '../../../../store/activeSourceFile/activeSourceFile.slice'

import { StructlogPanelComponent } from './StructlogPanel.component'

export const StructlogPanel: React.FC = () => {
  console.log('StructlogPanel')
  const dispatch = useDispatch()
  const structLogs = useSelector(structlogsSelectors.selectParsedStructLogs)
  const activeIndex = useSelector(activeStructLogSelectors.selectIndex)
  const previousIndex = useSelector(activeStructLogSelectors.selectPreviousIndex)
  const nextIndex = useSelector(activeStructLogSelectors.selectNextIndex)
  const currentInstructionFileId = useSelector(instructionsSelectors.selectCurrentFileId)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // event.preventDefault() won't stop scrolling via arrow keys when is fired in if statement
      if (event.key === 'ArrowDown' && !event.repeat) {
        event.preventDefault()
        dispatch(activeStructLogActions.setActiveStrucLog(nextIndex))
      }
      if (event.key === 'ArrowUp' && !event.repeat) {
        event.preventDefault()
        dispatch(activeStructLogActions.setActiveStrucLog(previousIndex))
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, previousIndex, nextIndex, dispatch])

  const handleSelect = (index: number) => {
    dispatch(activeStructLogActions.setActiveStrucLog(index))
    dispatch(activeSourceFileActions.setActiveSourceFile(currentInstructionFileId))
  }

  return (
    <StructlogPanelComponent
      structlogs={structLogs}
      activeStructlogIndex={activeIndex}
      handleSelect={handleSelect}
    />
  )
}
