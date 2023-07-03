export enum TransactionTraceResponseStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export enum SrcMapResponseStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  BUILDING = 'BUILDING',
  COMPILING = 'COMPILING',
  CANT_COMPILE = 'CANT_COMPILE',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}
