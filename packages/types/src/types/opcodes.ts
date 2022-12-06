export type TStorageOpCodes = 'SSTORE' | 'SLOAD'

export type TReturnTypeOpcodes = 'RETURN' | 'REVERT' | 'ERROR'

export type TCallTypeOpcodes = 'CALL' | 'CALLCODE' | 'DELEGATECALL' | 'STATICCALL'

export type TCreateTypeOpcodes = 'CREATE' | 'CREATE2'

export type TOpCodesWithArgs = TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes

export type TOpCodes = TOpCodesWithArgs | 'STOP'
