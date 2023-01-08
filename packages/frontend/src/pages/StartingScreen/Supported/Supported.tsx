import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'

import { useTypedDispatch } from '../../../store/storeHooks'
import { supportedChains } from '../../../helpers/chains'
import { analyzerActions } from '../../../store/analyzer/analyzer.slice'
import { ROUTES } from '../../../router'
import { Button } from '../../../components/Button'

import { StyledInput, StyledInputLabel, StyledInputWrapper, StyledMenuItem, StyledSelect, StyledStack } from './styles'
import type { IFormData, SupportedProps } from './Supported.types'

export const Supported = ({ ...props }: SupportedProps) => {
  const dispatch = useTypedDispatch()
  const navigate = useNavigate()

  const { control, handleSubmit, formState } = useForm<IFormData>({
    mode: 'all',
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

  console.log(formState)
  return (
    <StyledStack {...props}>
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
              onBlur={field.onBlur}
              onChange={field.onChange}
              error={fieldState.error?.type === 'required' || fieldState.error?.type === 'pattern'}
            />
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
              labelId="demo-simple-select-label"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
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
        sx={{ width: '200px', marginTop: '16px' }}
        onClick={handleSubmit(submitHandler)}
        disabled={!formState.isValid}
      >
        Process logs
      </Button>
    </StyledStack>
  )
}
