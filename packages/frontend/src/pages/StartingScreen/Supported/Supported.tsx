import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'

import { useTypedDispatch } from '../../../store/storeHooks'
import { supportedChains } from '../../../helpers/chains'
import { analyzerActions } from '../../../store/analyzer/analyzer.slice'
import { ROUTES } from '../../../router'
import { Button } from '../../../components/Button'

import {
  StyledErrorLabel,
  StyledInput,
  StyledInputLabel,
  StyledInputWrapper,
  StyledMenuItem,
  StyledSelect,
  StyledStack,
} from './styles'
import type { IFormData } from './Supported.types'

export const Supported = () => {
  const dispatch = useTypedDispatch()
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<IFormData>({
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
        }),
      )
      navigate(ROUTES.ANALYZER_PROGRESS_SCREEN)
    },
    [dispatch, navigate],
  )

  return (
    <StyledStack>
      <Controller
        control={control}
        defaultValue=""
        name="transactionHash"
        render={({ field, fieldState }) => (
          <StyledInputWrapper>
            <StyledInputLabel>Transaction hash</StyledInputLabel>
            <StyledInput
              fullWidth
              variant="outlined"
              value={field.value}
              onChange={field.onChange}
              error={
                fieldState.error?.type === 'required' ||
                fieldState.error?.type === 'pattern'
              }
            />
            <StyledErrorLabel>{fieldState.error?.message}</StyledErrorLabel>
          </StyledInputWrapper>
        )}
        rules={{
          required: 'This field is required',
          pattern: {
            value: /^0x([\dA-Fa-f]{64})$/,

            message: 'invalid transaction hash',
          },
        }}
      />
      <Controller
        control={control}
        defaultValue={1}
        name="chainId"
        render={({ field, fieldState }) => (
          <StyledInputWrapper>
            <StyledInputLabel>Network</StyledInputLabel>
            <StyledSelect
              variant="outlined"
              labelId="demo-simple-select-label"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.type === 'required'}
            >
              {Object.entries(supportedChains).map(([chainId, chainData]) => (
                <StyledMenuItem key={chainId.toString()} value={chainId}>
                  {chainData.name}
                </StyledMenuItem>
              ))}
            </StyledSelect>
          </StyledInputWrapper>
        )}
        rules={{
          required: 'This field is required',
        }}
      />
      <Button
        variant="contained"
        big={true}
        style={{ width: '200px', marginTop: '32px' }}
        onClick={handleSubmit(submitHandler)}
      >
        Process logs
      </Button>
    </StyledStack>
  )
}
