import { BaseOpcodesHex } from './opcodesHex'

export const OpcodesArguments = {
  [BaseOpcodesHex.STOP]: [],
  [BaseOpcodesHex.ADD]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.MUL]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.SUB]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.DIV]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.SDIV]: ['numerator', 'denominator'],
  [BaseOpcodesHex.MOD]: ['numerator', 'denominator'],
  [BaseOpcodesHex.SMOD]: ['numerator', 'denominator'],
  [BaseOpcodesHex.ADDMOD]: ['firstValue', 'secondValue', 'denominator'],
  [BaseOpcodesHex.MULMOD]: ['firstValue', 'secondValue', 'denominator'],
  [BaseOpcodesHex.EXP]: ['base', 'exponent'],
  [BaseOpcodesHex.SIGNEXTEND]: ['size', 'value'],
  [BaseOpcodesHex.LT]: ['leftValue', 'rightValue'],
  [BaseOpcodesHex.GT]: ['leftValue', 'rightValue'],
  [BaseOpcodesHex.SLT]: ['leftValue', 'rightValue'],
  [BaseOpcodesHex.SGT]: ['leftValue', 'rightValue'],
  [BaseOpcodesHex.EQ]: ['leftValue', 'rightValue'],
  [BaseOpcodesHex.ISZERO]: ['value'],
  [BaseOpcodesHex.AND]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.OR]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.XOR]: ['firstValue', 'secondValue'],
  [BaseOpcodesHex.NOT]: ['value'],
  [BaseOpcodesHex.BYTE]: ['offset', 'value'],
  [BaseOpcodesHex.SHL]: ['shift', 'value'],
  [BaseOpcodesHex.SHR]: ['shift', 'value'],
  [BaseOpcodesHex.SAR]: ['shift', 'value'],
  [BaseOpcodesHex.SHA3]: ['offset', 'size'],
  [BaseOpcodesHex.ADDRESS]: [],
  [BaseOpcodesHex.BALANCE]: ['address'],
  [BaseOpcodesHex.ORIGIN]: [],
  [BaseOpcodesHex.CALLER]: [],
  [BaseOpcodesHex.CALLVALUE]: [],
  [BaseOpcodesHex.CALLDATALOAD]: ['offset'],
  [BaseOpcodesHex.CALLDATASIZE]: [],
  [BaseOpcodesHex.CALLDATACOPY]: ['memoryOffset', 'callDataOffset', 'size'],
  [BaseOpcodesHex.CODESIZE]: [],
  [BaseOpcodesHex.CODECOPY]: ['memoryOffset', 'codeOffset', 'size'],
  [BaseOpcodesHex.GASPRICE]: [],
  [BaseOpcodesHex.EXTCODESIZE]: ['address'],
  [BaseOpcodesHex.EXTCODECOPY]: ['address', 'memoryOffset', 'codeOffset', 'size'],
  [BaseOpcodesHex.RETURNDATASIZE]: [],
  [BaseOpcodesHex.RETURNDATACOPY]: ['memoryOffset', 'returnDataOffset', 'size'],
  [BaseOpcodesHex.EXTCODEHASH]: ['address'],
  [BaseOpcodesHex.BLOCKHASH]: ['blockNumber'],
  [BaseOpcodesHex.COINBASE]: [],
  [BaseOpcodesHex.TIMESTAMP]: [],
  [BaseOpcodesHex.NUMBER]: [],
  [BaseOpcodesHex.PREVRANDAO]: [],
  [BaseOpcodesHex.GASLIMIT]: [],
  [BaseOpcodesHex.CHAINID]: [],
  [BaseOpcodesHex.SELFBALANCE]: [],
  [BaseOpcodesHex.BASEFEE]: [],
  [BaseOpcodesHex.POP]: ['stackItem'],
  [BaseOpcodesHex.MLOAD]: ['offset'],
  [BaseOpcodesHex.MSTORE]: ['offset', 'value'],
  [BaseOpcodesHex.MSTORE8]: ['offset', 'value'],
  [BaseOpcodesHex.SLOAD]: ['key'],
  [BaseOpcodesHex.SSTORE]: ['key', 'value'],
  [BaseOpcodesHex.JUMP]: ['counter'],
  [BaseOpcodesHex.JUMPI]: ['counter', 'condition'],
  [BaseOpcodesHex.PC]: [],
  [BaseOpcodesHex.MSIZE]: [],
  [BaseOpcodesHex.GAS]: [],
  [BaseOpcodesHex.JUMPDEST]: [],
  [BaseOpcodesHex.PUSH0]: [],
  [BaseOpcodesHex.PUSH1]: [],
  [BaseOpcodesHex.PUSH2]: [],
  [BaseOpcodesHex.PUSH3]: [],
  [BaseOpcodesHex.PUSH4]: [],
  [BaseOpcodesHex.PUSH5]: [],
  [BaseOpcodesHex.PUSH6]: [],
  [BaseOpcodesHex.PUSH7]: [],
  [BaseOpcodesHex.PUSH8]: [],
  [BaseOpcodesHex.PUSH9]: [],
  [BaseOpcodesHex.PUSH10]: [],
  [BaseOpcodesHex.PUSH11]: [],
  [BaseOpcodesHex.PUSH12]: [],
  [BaseOpcodesHex.PUSH13]: [],
  [BaseOpcodesHex.PUSH14]: [],
  [BaseOpcodesHex.PUSH15]: [],
  [BaseOpcodesHex.PUSH16]: [],
  [BaseOpcodesHex.PUSH17]: [],
  [BaseOpcodesHex.PUSH18]: [],
  [BaseOpcodesHex.PUSH19]: [],
  [BaseOpcodesHex.PUSH20]: [],
  [BaseOpcodesHex.PUSH21]: [],
  [BaseOpcodesHex.PUSH22]: [],
  [BaseOpcodesHex.PUSH23]: [],
  [BaseOpcodesHex.PUSH24]: [],
  [BaseOpcodesHex.PUSH25]: [],
  [BaseOpcodesHex.PUSH26]: [],
  [BaseOpcodesHex.PUSH27]: [],
  [BaseOpcodesHex.PUSH28]: [],
  [BaseOpcodesHex.PUSH29]: [],
  [BaseOpcodesHex.PUSH30]: [],
  [BaseOpcodesHex.PUSH31]: [],
  [BaseOpcodesHex.PUSH32]: [],
  [BaseOpcodesHex.DUP1]: ['value'],
  [BaseOpcodesHex.DUP2]: ['_', 'value'],
  [BaseOpcodesHex.DUP3]: ['_', '_', 'value'],
  [BaseOpcodesHex.DUP4]: ['_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP5]: ['_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP6]: ['_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP7]: ['_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP8]: ['_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP9]: ['_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP10]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP11]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP12]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP13]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP14]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP15]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.DUP16]: ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value'],
  [BaseOpcodesHex.SWAP1]: ['value1', 'value2'],
  [BaseOpcodesHex.SWAP2]: ['value1', '_', 'value2'],
  [BaseOpcodesHex.SWAP3]: ['value1', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP4]: ['value1', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP5]: ['value1', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP6]: ['value1', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP7]: ['value1', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP8]: ['value1', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP9]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP10]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP11]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP12]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP13]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP14]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP15]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.SWAP16]: ['value1', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', 'value2'],
  [BaseOpcodesHex.LOG0]: ['offset', 'size'],
  [BaseOpcodesHex.LOG1]: ['offset', 'size', 'topic1'],
  [BaseOpcodesHex.LOG2]: ['offset', 'size', 'topic1', 'topic2'],
  [BaseOpcodesHex.LOG3]: ['offset', 'size', 'topic1', 'topic2', 'topic3'],
  [BaseOpcodesHex.LOG4]: ['offset', 'size', 'topic1', 'topic2', 'topic3', 'topic4'],
  [BaseOpcodesHex.CREATE]: ['value', 'offset', 'size'],
  [BaseOpcodesHex.CALL]: ['gas', 'address', 'value', 'argsOffset', 'argsSize', 'returnOffset', 'returnSize'],
  [BaseOpcodesHex.CALLCODE]: ['gas', 'address', 'value', 'argsOffset', 'argsSize', 'returnOffset', 'returnSize'],
  [BaseOpcodesHex.RETURN]: ['offset', 'size'],
  [BaseOpcodesHex.DELEGATECALL]: ['gas', 'address', 'argsOffset', 'argsSize', 'returnOffset', 'returnSize'],
  [BaseOpcodesHex.CREATE2]: ['value', 'offset', 'size', 'salt'],
  [BaseOpcodesHex.STATICCALL]: ['gas', 'address', 'argsOffset', 'argsSize', 'returnOffset', 'returnSize'],
  [BaseOpcodesHex.REVERT]: ['offset', 'size'],
  [BaseOpcodesHex.INVALID]: [],
  [BaseOpcodesHex.SELFDESTRUCT]: ['address'],
}

export type TCallGroupOpcodesArgumentNames = {
  gas: string
  address: string
  value?: string
  argsOffset: string
  argsSize: string
  returnOffset: string
  returnSize: string
}

export type TCreateGroupOpcodesArgumentNames = {
  value: string
  offset: string
  size: string
  salt?: string
}

export type TReturnGroupTypeOpcodesArgumentNames = {
  offset: string
  size: string
}

export type ILogGroupTypeOpcodesArgumentNames = {
  offset: string
  size: string
  topic1?: string
  topic2?: string
  topic3?: string
  topic4?: string
}
