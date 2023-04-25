import type { TCallTypeOpcodes, TCreateTypeOpcodes, TReturnTypeOpcodes } from './opcodes'

export type TCallArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCallCodeArgsNames = 'gas' | 'address' | 'value' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TDelegateCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TStaticCallArgsNames = 'gas' | 'address' | 'inputOffset' | 'inputLength' | 'returnOffset' | 'returnLength'
export type TCreateArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize'
export type TCreate2ArgsNames = 'value' | 'byteCodePosition' | 'byteCodeSize' | 'salt'
export type TReturnArgsNames = 'position' | 'length'
export type TRevertArgsNames = 'position' | 'length'

export type TLog0ArgsNames = 'dataOffset' | 'dataLength'
export type TLog1ArgsNames = 'dataOffset' | 'dataLength' | 'topic1'
export type TLog2ArgsNames = 'dataOffset' | 'dataLength' | 'topic1' | 'topic2'
export type TLog3ArgsNames = 'dataOffset' | 'dataLength' | 'topic1' | 'topic2' | 'topic3'
export type TLog4ArgsNames = 'dataOffset' | 'dataLength' | 'topic1' | 'topic2' | 'topic3' | 'topic4'

export type TLog0Args = {
  [item in TLog0ArgsNames]: string
}

export type TLog1Args = {
  [item in TLog1ArgsNames]: string
}

export type TLog2Args = {
  [item in TLog2ArgsNames]: string
}

export type TLog3Args = {
  [item in TLog3ArgsNames]: string
}

export type TLog4Args = {
  [item in TLog4ArgsNames]: string
}

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

export type TCallTypeArgs = TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs
export type TCreateTypeArgs = TCreateArgs | TCreate2Args
export type TReturnTypeArgs = TReturnArgs | TRevertArgs

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

export type TLogArgs = {
  LOG0: TLog0Args
  LOG1: TLog1Args
  LOG2: TLog2Args
  LOG3: TLog3Args
  LOG4: TLog4Args
}

export type TOpCodesArgsArray = {
  [item in TReturnTypeOpcodes | TCallTypeOpcodes | TCreateTypeOpcodes]: (keyof TOpCodesArgs[item])[]
}

export type TLogArgsArray = {
  [item in keyof TLogArgs]: (keyof TLogArgs[item])[]
}
