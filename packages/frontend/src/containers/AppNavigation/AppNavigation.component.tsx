import React from 'react'
import { Box } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'

import { ROUTES } from '../../routes'
import { Button } from '../../components/Button'

import type { TAppNavigationComponentProps } from './AppNavigation.types'
import { StyledButtonWrapper, StyledNewTransactionButton, StyledTab, StyledTabs } from './AppNavigation.styles'

export const AppNavigationComponent: React.FC<TAppNavigationComponentProps> = ({
  activeTabName,
  convertNavigationTabName,
  handleTabChange,
  showAnalyzerLogs,
  toggleFunctionStackTrace,
  isFunctionStackTraceVisible,
}) => {
  return (
    <StyledButtonWrapper>
      <StyledNewTransactionButton />

      <Box>
        <StyledTabs
          value={activeTabName}
          centered
          sx={{
            '& .MuiTabs-flexContainer .MuiButtonBase-root ': {
              margin: 0.5,
            },
          }}
        >
          <StyledTab
            label="Data Manager"
            value={convertNavigationTabName(ROUTES.DATA_MANAGER)}
            onClick={() => handleTabChange(ROUTES.DATA_MANAGER)}
          />
          <StyledTab
            label="Transaction screen"
            value={convertNavigationTabName(ROUTES.TRANSACTION_SCREEN)}
            onClick={() => handleTabChange(ROUTES.TRANSACTION_SCREEN)}
          />
          <StyledTab
            label="Transaction Explorer"
            value={convertNavigationTabName(ROUTES.TRANSACTION_EXPLORER)}
            onClick={() => handleTabChange(ROUTES.TRANSACTION_EXPLORER)}
          />
        </StyledTabs>
      </Box>

      <Box>
        <Button
          variant="text"
          size="small"
          onClick={toggleFunctionStackTrace}
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          {`${isFunctionStackTraceVisible ? 'Hide' : 'Show'} Function Stack Trace`}
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={showAnalyzerLogs}
          sx={{
            whiteSpace: 'nowrap',
          }}
          startIcon={<DescriptionIcon />}
        >
          Show logs
        </Button>
      </Box>
    </StyledButtonWrapper>
  )
}
