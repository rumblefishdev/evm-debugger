import {
  BaseOpcodesHex,
  CallGroupOpcodes,
  CreateGroupOpcodes,
  FunctionBlockEndOpcodes,
  ReturnGroupTypeOpcodes,
  LogGroupTypeOpcodes,
} from '@evm-debuger/types'

export const checkOpcodeIfOfCallGroupType = (opcode: string) => {
  return Object.values(CallGroupOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfDelegateCallType = (opcode: string) => {
  return BaseOpcodesHex[opcode] === BaseOpcodesHex.DELEGATECALL
}

export const checkOpcodeIfOfCallOrStaticType = (opcode: string) => {
  return BaseOpcodesHex[opcode] === BaseOpcodesHex.CALL || BaseOpcodesHex[opcode] === BaseOpcodesHex.STATICCALL
}

export const checkOpcodeIfOfCreateGroupType = (opcode: string) => {
  return Object.values(CreateGroupOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfCallOrCreateGroupType = (opcode: string) => {
  return checkOpcodeIfOfCallGroupType(opcode) || checkOpcodeIfOfCreateGroupType(opcode)
}

export const checkOpcodeIfOfReturnGroupType = (opcode: string) => {
  return Object.values(ReturnGroupTypeOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfFunctionBlockEndType = (opcode: string) => {
  return Object.values(FunctionBlockEndOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfLogGroupType = (opcode: string) => {
  return Object.values(LogGroupTypeOpcodes).includes(BaseOpcodesHex[opcode])
}
