import type { TLogArgsArray, TOpCodesArgsArray } from '@evm-debuger/types'

export const OpCodesArgsArray: TOpCodesArgsArray = {
  STATICCALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
  REVERT: ['position', 'length'],
  RETURN: ['position', 'length'],
  DELEGATECALL: ['gas', 'address', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
  CREATE2: ['value', 'byteCodePosition', 'byteCodeSize', 'salt'],
  CREATE: ['value', 'byteCodePosition', 'byteCodeSize'],
  CALLCODE: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
  CALL: ['gas', 'address', 'value', 'inputOffset', 'inputLength', 'returnOffset', 'returnLength'],
}

export const LogArgsArray: TLogArgsArray = {
  LOG4: ['dataOffset', 'dataLength', 'topic1', 'topic2', 'topic3', 'topic4'],
  LOG3: ['dataOffset', 'dataLength', 'topic1', 'topic2', 'topic3'],
  LOG2: ['dataOffset', 'dataLength', 'topic1', 'topic2'],
  LOG1: ['dataOffset', 'dataLength', 'topic1'],
  LOG0: ['dataOffset', 'dataLength'],
}

export const OpcodesNamesArray = ['CALL', 'CALLCODE', 'DELEGATECALL', 'STATICCALL', 'CREATE', 'CREATE2', 'RETURN', 'REVERT', 'STOP']
