import type { TCallTypeOpcodes, TCreateTypeOpcodes, TReturnTypeOpcodes } from './opcodes'

export type TCallArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCallCodeArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TDelegateCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TStaticCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCreateArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize'
export type TCreate2ArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize' | 'salt'
export type TReturnArgsNames = 'position' | 'length'
export type TRevertArgsNames = 'position' | 'length'
export type TSStorArgsNames = 'key' | 'value'
export type TSLoadArgsNames = 'key'

export type TCallArgs = {
    [item in TCallArgsNames]: string
}

export type TCallCodeArgs = {
    [item in TCallCodeArgsNames]: string
}

export type TDelegateCallArgs = {
    [item in TDelegateCallArgsNames]: string
}

export type TStaticCallArgs = {
    [item in TStaticCallArgsNames]: string
}

export type TCreateArgs = {
    [item in TCreateArgsNames]: string
}

export type TCreate2Args = {
    [item in TCreate2ArgsNames]: string
}

export type TReturnArgs = {
    [item in TReturnArgsNames]: string
}

export type TRevertArgs = {
    [item in TRevertArgsNames]: string
}

export type TCallTypeArgs = TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs
export type TCreateTypeArgs = TCreateArgs | TCreate2Args
export type TReturnTypeArgs = TReturnArgs | TRevertArgs

export type TOpCodesArgs = {
    CALL: TCallArgs
    CALLCODE: TCallCodeArgs
    DELEGATECALL: TDelegateCallArgs
    STATICCALL: TStaticCallArgs
    CREATE: TCreateArgs
    CREATE2: TCreate2Args
    RETURN: TReturnArgs
    REVERT: TRevertArgs
}

export type TOpCodesArgsArray = {
    [item in TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes]: (keyof TOpCodesArgs[item])[]
}
