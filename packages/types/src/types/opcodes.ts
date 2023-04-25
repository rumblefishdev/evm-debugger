export type TStorageOpCodes = 'SSTORE' | 'SLOAD'

export type TLogOpcodes = 'LOG0' | 'LOG1' | 'LOG2' | 'LOG3' | 'LOG4'

export type TReturnTypeOpcodes = 'RETURN' | 'REVERT'

export type TCallTypeOpcodes = 'CALL' | 'CALLCODE' | 'DELEGATECALL' | 'STATICCALL'

export type TCreateTypeOpcodes = 'CREATE' | 'CREATE2'

export type TOpCodesWithArgs = TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes

export type TOpCodes = TOpCodesWithArgs | 'STOP'
