export enum ROUTES {
  BASE = 'evm-debugger',
  HOME = '/',
  APP = '/tx',
  TRANSACTION_SCREEN = '/tx/:chainId/:txHash/',
  DATA_MANAGER = '/tx/:chainId/:txHash/dataManager',
  TRANSACTION_EXPLORER = '/tx/:chainId/:txHash/gas_usage_map',
  REDIRECT_OLD = '/tx/:chainId/:txHash/transactionExplorer',
}
