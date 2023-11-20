export enum AnalyzerStages {
  FETCHING_TRANSACTION_INFO = 'Fetching transaction info',
  FETCHING_STRUCTLOGS = 'Fetching structlogs',
  GATHERING_CONTRACTS_INFORMATION = 'Gathering contracts information',
  FETCHING_BYTECODES = 'Fetching bytecodes',
  FETCHING_SOURCE_CODES = 'Fetching source codes',
  RUNNING_ANALYZER = 'Running analyzer',
}

export enum AnalyzerStagesStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum LogMessageStatus {
  INFO = 'INFO',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}
