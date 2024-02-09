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

export type TLogArgs = {
  LOG0: TLog0Args
  LOG1: TLog1Args
  LOG2: TLog2Args
  LOG3: TLog3Args
  LOG4: TLog4Args
}

export type TLogArgsArray = {
  [item in keyof TLogArgs]: (keyof TLogArgs[item])[]
}
