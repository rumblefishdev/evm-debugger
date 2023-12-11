import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ROUTES } from '../../routes'
import { DebuggerProcessButton } from '../DebuggerProcessButton'
import { chainNames, supportedChainsIdList, showChainOnStartScreen } from '../../config'

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

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsOpen(false)
    }
    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return (
    <>
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
                open={isOpen}
                onOpen={() => {
                  setIsOpen(true)
                }}
                onClose={() => {
                  setIsOpen(false)
                }}
                variant="outlined"
                labelId="demo-simple-select-label"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.type === 'required'}
                MenuProps={{
                  transitionDuration: 0,
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  style: {
                    zIndex: 10,
                  },

                  // style: { zIndex: 10 },
                  PaperProps: {
                    sx: {
                      height: 'auto',
                      borderRadius: '16px',
                      backgroundColor: '#344579',
                    },
                  },

                  disableScrollLock: true,
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                }}
              >
                {supportedChainsIdList.map(
                  (chainId) =>
                    showChainOnStartScreen[chainId] && (
                      <StyledMenuItem
                        key={chainId.toString()}
                        value={chainId}
                      >
                        {chainNames[chainId]}
                      </StyledMenuItem>
                    ),
                )}
              </StyledSelect>
            </StyledInputWrapper>
          )}
          rules={{
            required: 'This field is required',
          }}
        />
      </StyledStack>
      <DebuggerProcessButton onClick={handleSubmit(submitHandler)} />
    </>
  )
}
