export type CallArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type CallCodeArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type DelegateCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type StaticCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type CreateArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize'
export type Create2ArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize' | 'salt'
export type ReturnArgsNames = 'position' | 'length'
export type RevertArgsNames = 'position' | 'length'

export type CallArgs = {
    [item in CallArgsNames]: string
}

export type CallCodeArgs = {
    [item in CallCodeArgsNames]: string
}

export type DelegateCallArgs = {
    [item in DelegateCallArgsNames]: string
}

export type StaticCallArgs = {
    [item in StaticCallArgsNames]: string
}

export type CreateArgs = {
    [item in CreateArgsNames]: string
}

export type Create2Args = {
    [item in Create2ArgsNames]: string
}

export type ReturnArgs = {
    [item in ReturnArgsNames]: string
}

export type RevertArgs = {
    [item in RevertArgsNames]: string
}

export type OpCodesArgs = {
    CALL: CallArgs
    CALLCODE: CallCodeArgs
    DELEGATECALL: DelegateCallArgs
    STATICCALL: StaticCallArgs
    CREATE: CreateArgs
    CREATE2: Create2Args
    RETURN: ReturnArgs
    REVERT: RevertArgs
}

export type test = {
    [item in ReturnTypeOpcodes | CallTypeOpcodes | CreateTypeOpcodes]: Array<keyof OpCodesArgs[item]>
}

export const OpCodesArgsArray: test = {
    CALL: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CALLCODE: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    DELEGATECALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    STATICCALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CREATE: ['value', 'byteCodePosition', 'byteCodeSize'],
    CREATE2: ['value', 'byteCodePosition', 'byteCodeSize', 'salt'],
    RETURN: ['position', 'length'],
    REVERT: ['position', 'length'],
}

export const OpcodesNamesArray = ['CALL', 'CALLCODE', 'DELEGATECALL', 'STATICCALL', 'CREATE', 'CREATE2', 'RETURN', 'REVERT', 'STOP']

export type ReturnTypeOpcodes = 'RETURN' | 'REVERT'

export type CallTypeOpcodes = 'CALL' | 'CALLCODE' | 'DELEGATECALL' | 'STATICCALL'

export type CreateTypeOpcodes = 'CREATE' | 'CREATE2'

export type OpCodesWithArgs = ReturnTypeOpcodes | CallTypeOpcodes | CreateTypeOpcodes

export type OpCodes = OpCodesWithArgs | 'STOP'

export type CurrentStackArgs<CurrentOpCode extends OpCodesWithArgs> = OpCodesArgs[CurrentOpCode]
