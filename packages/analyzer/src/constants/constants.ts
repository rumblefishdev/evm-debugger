import { TOpCodesArgsArray } from '@evm-debuger/types'

export const OpCodesArgsArray: TOpCodesArgsArray = {
    CALL: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CALLCODE: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    DELEGATECALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    STATICCALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
    CREATE: ['value', 'byteCodePosition', 'byteCodeSize'],
    CREATE2: ['value', 'byteCodePosition', 'byteCodeSize', 'salt'],
    RETURN: ['position', 'length'],
    REVERT: ['position', 'length'],
}

export const SLoadArgsArray = ['key']
export const SStoreArgsArray = ['key', 'value']

export const OpcodesNamesArray = ['CALL', 'CALLCODE', 'DELEGATECALL', 'STATICCALL', 'CREATE', 'CREATE2', 'RETURN', 'REVERT', 'STOP']

export const BuiltinErrors: Record<string, { signature: string; inputs: Array<string>; name: string; reason?: boolean }> = {
    '0x08c379a0': { signature: 'Error(string)', name: 'Error', inputs: ['string'], reason: true },
    '0x4e487b71': { signature: 'Panic(uint256)', name: 'Panic', inputs: ['uint256'] },
}
