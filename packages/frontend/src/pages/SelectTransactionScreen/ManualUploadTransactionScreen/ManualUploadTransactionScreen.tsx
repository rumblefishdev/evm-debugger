import React, { useCallback } from 'react'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { useTypedDispatch } from '../../../store/storeHooks'
import { UploadJsonFile } from '../../../components/UploadJsonFile'
import {
  EtherscanAbiFetcher,
  StaticStructLogProvider,
  StaticTxInfoProvider,
} from '../../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../../store/analyzer/analyzer.slice'
import { validateSchema } from '../../../helpers/validateSchema'
import { typedNavigate } from '../../../router'
import { etherscanKey, etherscanUrl } from '../../../config'

import { traceTransactionSchema, txInfoSchema } from './schemas'
import type { ManualUploadTransactionScreenProps } from './ManualUploadTransactionScreen.types'
import { StyledStack } from './styles'

export interface IManualUploadFormData {
  txInfo: TTransactionInfo
  structLogs: { structLogs: IStructLog[] }
}

export const ManualUploadTransactionScreen = ({
  ...props
}: ManualUploadTransactionScreenProps) => {
  const dispatch = useTypedDispatch()
  const navigate = useNavigate()

  const { control, handleSubmit, formState } = useForm<IManualUploadFormData>({
    mode: 'onBlur',
  })

  const submitHandler = useCallback(
    (data: IManualUploadFormData) => {
      dispatch(
        analyzerActions.runAnalyzer({
          txInfoProvider: new StaticTxInfoProvider(data.txInfo),
          structLogProvider: new StaticStructLogProvider(
            data.structLogs.structLogs,
          ),
          abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
        }),
      )
      typedNavigate(navigate, '/dataManager')
    },
    [dispatch],
  )

  return (
    <StyledStack {...props} spacing={4}>
      <Stack direction="row" spacing={4}>
        <Controller
          control={control}
          name="txInfo"
          render={({ field }) => (
            <UploadJsonFile
              label="Upload result of eth_getTransactionByHash"
              onChange={field.onChange}
              onBlur={field.onBlur}
              title="Transaction info"
            />
          )}
          rules={{
            validate: {
              schema: validateSchema(txInfoSchema),
            },
            required: 'This field is required',
          }}
        />
      </Stack>
      <ErrorMessage errors={formState.errors} name="txInfo" />
      <Stack direction="row" spacing={4}>
        <Controller
          control={control}
          name="structLogs"
          render={({ field }) => (
            <UploadJsonFile
              label="Upload result of debug_traceTransaction"
              onChange={field.onChange}
              onBlur={field.onBlur}
              title="Struct Logs"
            />
          )}
          rules={{
            validate: {
              schema: validateSchema(traceTransactionSchema),
            },
            required: 'This field is required',
          }}
        />
      </Stack>
      <ErrorMessage errors={formState.errors} name="structLogs" />

      <Button
        variant="contained"
        component="label"
        onClick={handleSubmit(submitHandler)}
        disabled={!formState.isValid}
      >
        Process logs
      </Button>
    </StyledStack>
  )
}
