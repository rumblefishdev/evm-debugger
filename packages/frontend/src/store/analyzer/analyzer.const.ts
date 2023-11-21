export enum AnalyzerStages {
  INITIALIZING_ANALYZER = 'Initializing analyzer',
  FETCHING_TRANSACTION_INFO = 'Fetching transaction info',
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
}

export enum LogMessageStatus {
  INFO = 'INFO',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}
