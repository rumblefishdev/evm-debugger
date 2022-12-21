import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { Button, Typography, Stack } from '@mui/material'
import { ethers } from 'ethers'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DataAdder } from '../../components/DataAdder'
import { typedNavigate } from '../../router'
import { loadStructLogs } from '../../store/structlogs/structlogs.slice'
import { setTxInfo } from '../../store/rawTxData/rawTxData.slice'
import { useTypedDispatch, useTypedSelector } from '../../store/storeHooks'

import type { SelectTransactionScreenProps } from './SelectTransactionScreen.types'
import { StyledStack } from './styles'

export const SelectTransactionScreen = ({ ...props }: SelectTransactionScreenProps) => {
  const dispatch = useTypedDispatch()
  const navigate = useNavigate()

  const [isTxInfoDialogOpen, setTxInfoDialog] = useState(false)
  const [isStructLogsDialogOpen, setStructLogsDialog] = useState(false)

  const structLogs = useTypedSelector((state) => state.rawTxData.structLogs)
  const txInfo = useTypedSelector((state) => state.rawTxData.transactionInfo)

  const submitHandler = useCallback(() => {
    if (txInfo && structLogs) typedNavigate(navigate, '/summary')
  }, [txInfo, structLogs])

  const handleTxInfoUpload = useCallback((data: string) => {
    dispatch(setTxInfo(JSON.parse(data) as TTransactionInfo))
    setTxInfoDialog(false)
  }, [])

  const handleStructLogsUpload = useCallback((data: string) => {
    dispatch(loadStructLogs(JSON.parse(data) as IStructLog[]))
    setStructLogsDialog(false)
  }, [])

  return (
    <StyledStack {...props} spacing={4}>
      <Stack direction="row" spacing={4}>
        <Typography variant="h4">Upload result of eth_getTransactionByHash</Typography>
        <Button variant="contained" onClick={() => setTxInfoDialog(true)}>
          Add
        </Button>
        <DataAdder
          title="Transaction info"
          submithandler={handleTxInfoUpload}
          open={isTxInfoDialogOpen}
          onClose={() => setTxInfoDialog(false)}
        />
      </Stack>
      <Stack direction="row" spacing={4}>
        <Typography variant="h4">Upload result of debug_traceTransaction</Typography>
        <Button variant="contained" onClick={() => setStructLogsDialog(true)}>
          Add
        </Button>
        <DataAdder
          title="Struct Logs"
          submithandler={handleStructLogsUpload}
          open={isStructLogsDialogOpen}
          onClose={() => setStructLogsDialog(false)}
        />
      </Stack>

      <Button variant="contained" component="label" onClick={submitHandler}>
        Process logs
      </Button>
    </StyledStack>
  )
}
