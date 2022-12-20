import React, {useCallback} from 'react'
import type { SelectChangeEvent} from "@mui/material";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

export const SupportedChainsTransactionScreen = () => {
    const [transactionHash, setTransactionHash] = React.useState('');
    const [network, setNetwork] = React.useState('');

    const submitHandler = useCallback( (hash: string) => {
        if (hash) console.log(hash)
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        setNetwork(event.target.value as string);
    };

    const onTransactionHashInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionHash(event.target.value)
    }

    return (
        <Box
            component="form"
            sx={{'& .MuiTextField-root': {m: 1}}}
            noValidate
            autoComplete="off">
            <TextField fullWidth label="Transaction hash" variant="outlined" value={transactionHash} onChange={onTransactionHashInputChange} />
            <FormControl fullWidth  sx={{m: 1}}>
                <InputLabel>Network</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={network}
                    label="Network"
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Etherum</MenuItem>
                </Select>
            </FormControl>
            <Button sx={{m: 1}} variant="contained" component="label" onClick={() => submitHandler(transactionHash)}>
                Process logs
            </Button>
        </Box>
    )
}
