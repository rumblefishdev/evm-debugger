import { BaseOpcodesHex, CallGroupOpcodes, CreateGroupOpcodes, ReturnGroupTypeOpcodes } from '@evm-debuger/types'

export const checkOpcodeIfOfCallGroupType = (opcode: string) => {
  return Object.values(CallGroupOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfDelegateCallType = (opcode: string) => {
  return BaseOpcodesHex[opcode] === BaseOpcodesHex.DELEGATECALL
}

export const checkOpcodeIfOfCreateGroupType = (opcode: string) => {
  return Object.values(CreateGroupOpcodes).includes(BaseOpcodesHex[opcode])
}

export const checkOpcodeIfOfReturnGroupType = (opcode: string) => {
  return Object.values(ReturnGroupTypeOpcodes).includes(BaseOpcodesHex[opcode])
}
