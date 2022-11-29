import { Button, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTypedDispatch } from '../../store/storeHooks'
import { loadStructLogs } from '../../store/structLogs/structLogs.slice'
import { loadTraceLogs } from '../../store/traceLogs/traceLogs.slice'

import type { SelectTransactionScreenProps } from './SelectTransactionScreen.types'
import { StyledBox } from './styles'

export const SelectTransactionScreen = ({ ...props }: SelectTransactionScreenProps) => {
    const [trace, setTrace] = useState<string>('')
    const [struct, setStruct] = useState<string>('')

    const navigate = useNavigate()
    const dispatch = useTypedDispatch()

    const uploadHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'struct' | 'trace') => {
        const fileReader = new FileReader()
        if (event.target.files?.length) {
            fileReader.readAsText(event.target.files[0])
            fileReader.onload = (loadEvent) => {
                // console.log(loadEvent!.target!.result)
                if (type === 'struct') setStruct(loadEvent!.target!.result as string)
                if (type === 'trace') setTrace(loadEvent!.target!.result as string)
            }
        } else {
            if (type === 'struct') setStruct('')
            if (type === 'trace') setTrace('')
        }
    }, [])

    const submitHandler = useCallback(() => {
        console.log(trace)
        console.log(struct)
        if (trace && struct) {
            dispatch(loadTraceLogs(trace))
            dispatch(loadStructLogs(struct))
            navigate('/mainDisplay')
        }
    }, [trace, struct])

    return (
        <StyledBox {...props}>
            <Typography variant="h4">Upload Trace Logs</Typography>
            <Button variant="contained" component="label">
                Upload
                <input hidden type="file" onChange={(event) => uploadHandler(event, 'trace')}></input>
            </Button>
            <Typography variant="h4">Upload Struct Logs</Typography>
            <Button variant="contained" component="label">
                Upload
                <input hidden type="file" onChange={(event) => uploadHandler(event, 'struct')}></input>
            </Button>

            <Typography variant="h4">Display Information</Typography>
            <Button variant="contained" component="label" onClick={submitHandler}>
                Done
            </Button>
        </StyledBox>
    )
}
