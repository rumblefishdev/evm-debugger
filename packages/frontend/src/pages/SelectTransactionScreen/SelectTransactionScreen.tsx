import type { TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { Button, Typography, Stack } from '@mui/material'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFileUpload } from '../../hooks/useFileUpload'
import { setStructLogs, setTxInfo } from '../../store/rawTxData/rawTxData.slice'
import { useTypedDispatch } from '../../store/storeHooks'

import type { SelectTransactionScreenProps } from './SelectTransactionScreen.types'
import { StyledStack } from './styles'

export const SelectTransactionScreen = ({ ...props }: SelectTransactionScreenProps) => {
    const [txInfo, uploadTxInfo] = useFileUpload()
    const [structLogs, uploadStructLogs] = useFileUpload()

    const navigate = useNavigate()
    const dispatch = useTypedDispatch()

    const submitHandler = useCallback(() => {
        if (txInfo && structLogs) {
            dispatch(setTxInfo(JSON.parse(txInfo) as TTransactionInfo))
            dispatch(setStructLogs(JSON.parse(structLogs) as TTransactionTraceResult))
            navigate('/mainDisplay')
        }
    }, [txInfo, structLogs])

    return (
        <StyledStack {...props} spacing={4}>
            <Stack direction="row" spacing={4}>
                <Typography variant="h4">Upload result of eth_getTransactionByHash</Typography>
                <Button variant="contained" component="label">
                    Upload
                    <input hidden type="file" onChange={uploadTxInfo}></input>
                </Button>
            </Stack>
            <Stack direction="row" spacing={4}>
                <Typography variant="h4">Upload result of debug_traceTransaction</Typography>
                <Button variant="contained" component="label">
                    Upload
                    <input hidden type="file" onChange={uploadStructLogs}></input>
                </Button>
            </Stack>

            <Button variant="contained" component="label" onClick={submitHandler}>
                Process logs
            </Button>
        </StyledStack>
    )
}
