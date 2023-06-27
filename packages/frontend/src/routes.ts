export enum ROUTES {
  BASE = 'evm-debugger',
  HOME = '/',
  MANUAL_UPLOAD = '/manualUpload',
  APP = '/tx',
  TRANSACTION_SCREEN = '/tx/:chainId/:txHash',
  TRANSACTION_SCREEN_MANUAL = '/tx/manual',
  DATA_MANAGER = '/tx/:chainId/:txHash/dataManager',
  DATA_MANAGER_MANUAL = '/tx/manual/dataManager',
  STRUCTLOGS_EXPLORER = '/tx/:chainId/:txHash/structlogsExplorer',
  STRUCTLOGS_EXPLORER_MANUAL = '/tx/manual/structlogsExplorer',
  ANALYZER_PROGRESS_SCREEN = '/analyzerProgressScreen',
}
