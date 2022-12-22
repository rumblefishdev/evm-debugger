import type { IStructLog } from '@evm-debuger/types'
import { Button } from '@mui/material'
import React, { useCallback, useState } from 'react'

import { BytecodeInfoCard } from '../../components/BytecodeInfoCard'
import { MemoryInfoCard } from '../../components/MemoryInfoCard'
import { Navigation } from '../../components/Navigation'
import { StackInfoCard } from '../../components/StackInfoCard'
import { StorageInfoCard } from '../../components/StorageInfoCard'
import { StructLogItem } from '../../components/StructLogItem'
import { selectParsedStructLogs } from '../../store/rawTxData/rawTxData.slice'
import { useTypedSelector } from '../../store/storeHooks'

import type { StructlogsExplorerProps } from './StructlogsExplorer.types'
import { StyledContentWrapper, StyledInformationCard, StyledNavigation, StyledStack, StyledStructLogCard } from './styles'

type TRenderTab = 'stack' | 'memory' | 'storage' | 'bytecode'

export const StructlogsExplorer = ({ ...props }: StructlogsExplorerProps) => {
  const [currentTab, setCurrentTab] = useState<TRenderTab>('stack')
  const [selectedStructLog, setSelectedStructLog] = useState<IStructLog>({} as IStructLog)

  const currentTraceLog = useTypedSelector((state) => state.activeBlock)
  const structLogs = useTypedSelector((state) => selectParsedStructLogs(state, currentTraceLog.startIndex, currentTraceLog.returnIndex))

  const renderTab = useCallback(() => {
    switch (currentTab) {
      case 'stack': {
        return <StackInfoCard stack={selectedStructLog.stack ?? []} />
      }
      case 'memory': {
        return <MemoryInfoCard memory={selectedStructLog.memory ?? []} />
      }
      case 'storage': {
        return <StorageInfoCard storage={selectedStructLog.storage ?? {}} />
      }
      case 'bytecode': {
        return <BytecodeInfoCard bytecode={selectedStructLog} storage={selectedStructLog.storage ?? {}} />
      }
      default: {
        return null
      }
    }
  }, [currentTab, selectedStructLog.stack])

  return (
    <StyledStack>
      <Navigation />
      <StyledContentWrapper {...props}>
        <StyledStructLogCard>
          {structLogs.map((structLog, index) => {
            return <StructLogItem key={index} counter={structLog.pc} type={structLog.op} onClick={() => setSelectedStructLog(structLog)} />
          })}
        </StyledStructLogCard>
        <StyledInformationCard>
          <StyledNavigation>
            <Button variant="outlined" onClick={() => setCurrentTab('stack')}>
              Stack
            </Button>
            <Button variant="outlined" onClick={() => setCurrentTab('memory')}>
              Memory
            </Button>
            <Button variant="outlined" onClick={() => setCurrentTab('storage')}>
              Storage
            </Button>
            <Button variant="outlined" onClick={() => setCurrentTab('bytecode')}>
              Bytecode
            </Button>
          </StyledNavigation>
          {renderTab()}
        </StyledInformationCard>
      </StyledContentWrapper>
    </StyledStack>
  )
}
