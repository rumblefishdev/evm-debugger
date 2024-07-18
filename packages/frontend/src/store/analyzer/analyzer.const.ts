export enum AnalyzerStages {
  INITIALIZING_ANALYZER = 'Initializing analyzer',
  FETCHING_TRANSACTION_INFO = 'Fetching transaction info',
  BLOCK_NOT_FINALIZED_YET = 'Block is not finalized yet',
  BLOCK_FINALIZED = 'Block is finalized',
  PREPARING_STRUCTLOGS = 'Preparing structlogs',
  DOWNLOADING_AND_PARSING_STRUCTLOGS = 'Downloading and parsing structlogs',
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
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

export enum LogMessageStatus {
  INFO = 'INFO',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}
