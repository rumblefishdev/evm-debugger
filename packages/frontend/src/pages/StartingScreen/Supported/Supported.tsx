import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from '@mui/material'

import { supportedChains } from '../../../helpers/chains'
import { ROUTES } from '../../../routes'
import { Button } from '../../../components/Button'
import { reportIssuePageUrl } from '../../../config'

import { StyledErrorLabel, StyledInput, StyledInputLabel, StyledInputWrapper, StyledMenuItem, StyledSelect, StyledStack } from './styles'
import type { IFormData } from './Supported.types'

export const Supported = () => {
  const { control, handleSubmit } = useForm<IFormData>({
    mode: 'onChange',
  })

  const submitHandler = useCallback((data: IFormData) => {
    window.location.replace(
      `${location.protocol}//${location.host}/${ROUTES.BASE}${ROUTES.TRANSACTION_SCREEN.replace(':txHash', data.transactionHash).replace(
        ':chainId',
        data.chainId as unknown as string,
      )}`,
    )
  }, [])

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
              error={fieldState.error?.type === 'required' || fieldState.error?.type === 'pattern'}
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
                <StyledMenuItem
                  key={chainId.toString()}
                  value={chainId}
                >
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
        size="large"
        style={{ width: '200px', marginTop: '32px' }}
        onClick={handleSubmit(submitHandler)}
      >
        Process logs
      </Button>
      <b>
        <Link
          variant={'caption'}
          href={reportIssuePageUrl}
        >
          Found a bug? Click to raise an issue.
        </Link>
      </b>
    </StyledStack>
  )
}
