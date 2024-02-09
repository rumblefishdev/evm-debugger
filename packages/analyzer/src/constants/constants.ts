import type { TLogArgsArray } from '@evm-debuger/types'

export const LogArgsArray: TLogArgsArray = {
  LOG4: ['dataOffset', 'dataLength', 'topic1', 'topic2', 'topic3', 'topic4'],
  LOG3: ['dataOffset', 'dataLength', 'topic1', 'topic2', 'topic3'],
  LOG2: ['dataOffset', 'dataLength', 'topic1', 'topic2'],
  LOG1: ['dataOffset', 'dataLength', 'topic1'],
  LOG0: ['dataOffset', 'dataLength'],
}

export const OpcodesNamesArray = ['CALL', 'CALLCODE', 'DELEGATECALL', 'STATICCALL', 'CREATE', 'CREATE2', 'RETURN', 'REVERT', 'STOP']
