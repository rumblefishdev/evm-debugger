import { BaseOpcodesHex } from './opcodesHex'

export const StorageGroupOpcodes = [BaseOpcodesHex.SSTORE, BaseOpcodesHex.SLOAD]
export const LogGroupOpcodes = [BaseOpcodesHex.LOG0, BaseOpcodesHex.LOG1, BaseOpcodesHex.LOG2, BaseOpcodesHex.LOG3, BaseOpcodesHex.LOG4]
export const ReturnGroupTypeOpcodes = [BaseOpcodesHex.RETURN, BaseOpcodesHex.REVERT]
export const CallGroupOpcodes = [BaseOpcodesHex.CALL, BaseOpcodesHex.CALLCODE, BaseOpcodesHex.DELEGATECALL, BaseOpcodesHex.STATICCALL]
export const CreateGroupOpcodes = [BaseOpcodesHex.CREATE, BaseOpcodesHex.CREATE2]
export const FunctionBlockStartOpcodes = [
  BaseOpcodesHex.CALL,
  BaseOpcodesHex.CALLCODE,
  BaseOpcodesHex.DELEGATECALL,
  BaseOpcodesHex.STATICCALL,
  BaseOpcodesHex.CREATE,
  BaseOpcodesHex.CREATE2,
]
export const FunctionBlockEndOpcodes = [BaseOpcodesHex.STOP, BaseOpcodesHex.RETURN, BaseOpcodesHex.REVERT]
