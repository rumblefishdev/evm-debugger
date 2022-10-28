export type TCallArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCallCodeArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TDelegateCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TStaticCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCreateArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize'
export type TCreate2ArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize' | 'salt'
export type TReturnArgsNames = 'position' | 'length'
export type TRevertArgsNames = 'position' | 'length'

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

export type TOpCodesArgNamesArray = {
    [item in TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes]: Array<keyof TOpCodesArgs[item]>
}

export type TReturnTypeOpcodes = 'RETURN' | 'REVERT'

export type TCallTypeOpcodes = 'CALL' | 'CALLCODE' | 'DELEGATECALL' | 'STATICCALL'

export type TCreateTypeOpcodes = 'CREATE' | 'CREATE2'

export type TOpCodesWithArgs = TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes

export type TOpCodes = TOpCodesWithArgs | 'STOP'

export type TCurrentStackArgs<CurrentOpCode extends TOpCodesWithArgs> = TOpCodesArgs[CurrentOpCode]

export const OpCodesArgsArray: TOpCodesArgNamesArray = {
    CALL: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CALLCODE: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    DELEGATECALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    STATICCALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CREATE: ['value', 'byteCodePosition', 'byteCodeSize'],
    CREATE2: ['value', 'byteCodePosition', 'byteCodeSize', 'salt'],
    RETURN: ['position', 'length'],
    REVERT: ['position', 'length'],
}
export const OpcodesNamesArray: TOpCodes[] = [
    'CALL',
    'CALLCODE',
    'DELEGATECALL',
    'STATICCALL',
    'CREATE',
    'CREATE2',
    'RETURN',
    'REVERT',
    'STOP',
]
