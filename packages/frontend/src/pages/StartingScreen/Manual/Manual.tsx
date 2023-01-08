import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../../components/Button'
import { UploadBox } from '../../../components/UploadBox'
import { etherscanKey, etherscanUrl, jsonRpcProvider } from '../../../config'
import { validateSchema } from '../../../helpers/validateSchema'
import { ROUTES } from '../../../router'
import {
  EtherscanAbiFetcher,
  JSONRpcBytecodeFetcher,
  StaticStructLogProvider,
  StaticTxInfoProvider,
} from '../../../store/analyzer/analyzer.providers'
import { analyzerActions } from '../../../store/analyzer/analyzer.slice'
import { useTypedDispatch } from '../../../store/storeHooks'

import { traceTransactionSchema, txInfoSchema } from './schemas'
import type { IManualUploadFormData, ManualProps } from './Manual.types'
import { StyledLine, StyledStack } from './styles'

export const Manual = ({ ...props }: ManualProps) => {
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
          structLogProvider: new StaticStructLogProvider(data.structLogs.structLogs),
          bytecodeProvider: new JSONRpcBytecodeFetcher(jsonRpcProvider[1]),
          abiProvider: new EtherscanAbiFetcher(etherscanUrl, etherscanKey),
        })
      )
      navigate(ROUTES.ANALYZER_PROGRESS_SCREEN)
    },
    [dispatch, navigate]
  )

  return (
    <StyledStack {...props}>
      <Controller
        control={control}
        name="txInfo"
        render={({ field, fieldState }) => (
          <UploadBox
            isWrongFile={fieldState.error?.type === 'schema'}
            uploadInfo="Upload result of eth_getTransactionByHash"
            onChange={field.onChange}
            onBlur={field.onBlur}
            title="Transaction info"
            isUploaded={Boolean(field.value)}
          />
        )}
        rules={{
          validate: {
            schema: validateSchema(txInfoSchema),
          },
          required: 'This field is required',
        }}
      />
      <StyledLine />
      <Controller
        control={control}
        name="structLogs"
        render={({ field, fieldState }) => (
          <UploadBox
            isWrongFile={fieldState.error?.type === 'schema'}
            uploadInfo="Upload result of debug_traceTransaction"
            onChange={field.onChange}
            onBlur={field.onBlur}
            title="Struct logs"
            isUploaded={Boolean(field.value)}
          />
        )}
        rules={{
          validate: {
            schema: validateSchema(traceTransactionSchema),
          },
          required: 'This field is required',
        }}
      />
      <Button
        variant="contained"
        big={true}
        sx={{ width: '200px', marginTop: '16px' }}
        onClick={handleSubmit(submitHandler)}
        disabled={!formState.isValid}
      >
        Process logs
      </Button>
    </StyledStack>
  )
}
