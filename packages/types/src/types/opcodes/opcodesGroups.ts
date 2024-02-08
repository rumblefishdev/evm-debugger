export enum StorageOpcodes {
  SSTORE = 'SSTORE',
  SLOAD = 'SLOAD',
}

export enum LogOpcodes {
  LOG0 = 'LOG0',
  LOG1 = 'LOG1',
  LOG2 = 'LOG2',
  LOG3 = 'LOG3',
  LOG4 = 'LOG4',
}
export enum ReturnTypeOpcodes {
  RETURN = 'RETURN',
  REVERT = 'REVERT',
}

export enum CallOpcodes {
  CALL = 'CALL',
  CALLCODE = 'CALLCODE',
  DELEGATECALL = 'DELEGATECALL',
  STATICCALL = 'STATICCALL',
}

export enum CreateOpcodes {
  CREATE = 'CREATE',
  CREATE2 = 'CREATE2',
}

export enum FunctionBlockStartOpcodes {
  CALL = 'CALL',
  CALLCODE = 'CALLCODE',
  DELEGATECALL = 'DELEGATECALL',
  STATICCALL = 'STATICCALL',
  CREATE = 'CREATE',
  CREATE2 = 'CREATE2',
}

export enum FunctionBlockEndOpcodes {
  STOP = 'STOP',
  RETURN = 'RETURN',
  REVERT = 'REVERT',
}
