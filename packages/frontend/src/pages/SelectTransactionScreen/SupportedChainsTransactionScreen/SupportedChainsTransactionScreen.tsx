import React, { useCallback } from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage } from '@hookform/error-message'

import type { IAbiProvider, IBytecodeProvider, IStructLogProvider, ITxInfoProvider } from '../../../store/analyzer/analyzer.types'
import {
  EtherscanAbiFetcher,
  JSONRpcBytecodeFetcher,
  JSONRpcTxInfoFetcher,
  TransactionTraceFetcher,
} from '../../../store/analyzer/analyzer.providers'
import { etherscanKey, etherscanUrl, jsonRpcProvider, transactionTraceProviderUrl } from '../../../config'
import { useTypedDispatch } from '../../../store/storeHooks'
import { analyzerActions } from '../../../store/analyzer/analyzer.slice'
import { ROUTES } from '../../../router'

type SupportedChain = {
  name: string
  txInfoProvider: (hash: string) => ITxInfoProvider
  structLogProvider: (hash: string) => IStructLogProvider
  abiProvider?: IAbiProvider
  bytecodeProvider?: IBytecodeProvider
}

type ChainId = number

const supportedChains: Record<ChainId, SupportedChain> = {
  1: {
    txInfoProvider: (hash: string) => new JSONRpcTxInfoFetcher(hash, jsonRpcProvider[1]),
    structLogProvider: (hash: string) => new TransactionTraceFetcher(transactionTraceProviderUrl, hash, 1),
    name: 'Ethereum',
    bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[1]),
    abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
  },
}

export interface IFormData {
  transactionHash: string
  chainId: ChainId
}

export const SupportedChainsTransactionScreen = () => {
  const dispatch = useTypedDispatch()
  const navigate = useNavigate()

  const { control, handleSubmit, formState } = useForm<IFormData>({
    mode: 'onChange',
  })

  const submitHandler = useCallback(
    (data: IFormData) => {
      const chainData = supportedChains[data.chainId]
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: chainData.txInfoProvider(data.transactionHash),
          structLogProvider: chainData.structLogProvider(data.transactionHash),
          bytecodeProvider: chainData.bytecodeProvider,
          abiProvider: chainData.abiProvider,
        })
      )
      navigate(ROUTES.ANALYZER_PROGRESS_SCREEN)
    },
    [dispatch, navigate]
  )
  return (
    <Box component="form" sx={{ '& .MuiTextField-root': { m: 1 } }} noValidate autoComplete="off">
      <Controller
        control={control}
        defaultValue=""
        name="transactionHash"
        render={({ field }) => (
          <TextField fullWidth label="Transaction hash" variant="outlined" value={field.value} onChange={field.onChange} />
        )}
        rules={{
          required: 'This field is required',
          pattern: {
            value: /^0x([\dA-Fa-f]{64})$/,

            message: 'invalid transaction hash',
          },
        }}
      />
      <ErrorMessage errors={formState.errors} name="transactionHash" />

      <Controller
        control={control}
        defaultValue={1}
        name="chainId"
        render={({ field }) => (
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel>Network</InputLabel>
            <Select labelId="demo-simple-select-label" value={field.value} label="Network" onChange={field.onChange}>
              {Object.entries(supportedChains).map(([chainId, chainData]) => (
                <MenuItem key={chainId.toString()} value={chainId}>
                  {chainData.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        rules={{
          required: 'This field is required',
        }}
      />

      <ErrorMessage errors={formState.errors} name="chainId" />

      <Button sx={{ m: 1 }} variant="contained" component="label" onClick={handleSubmit(submitHandler)} disabled={!formState.isValid}>
        Process logs
      </Button>
    </Box>
  )
}
