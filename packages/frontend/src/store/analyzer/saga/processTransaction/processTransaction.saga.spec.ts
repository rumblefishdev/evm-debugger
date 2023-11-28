import { testSaga } from 'redux-saga-test-plan'
import { ChainId } from '@evm-debuger/types'

import { analyzerActions } from '../../analyzer.slice'
import { AnalyzerStages } from '../../analyzer.const'
import { createInfoLogMessage } from '../../analyzer.utils'
import { testLogMessageViaInspect } from '../../../../helpers/sagaTests'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'

import { processTransactionSaga } from './processTransaction.saga'
import { processTransactionTakesMatchers } from './processTransaction.takes'

const TRANSACTION_HASH = '0x1234567890'
const CHAIN_ID = ChainId.mainnet

describe('processTransactionSaga', () => {
  const logMessage = createInfoLogMessage(`Running transaction: ${TRANSACTION_HASH} on chain: ${CHAIN_ID}`)

  it('should process transaction', () => {
    testSaga(processTransactionSaga, analyzerActions.processTransaction({ transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID }))
      .next()
      .put(analyzerActions.initializeTransactionProcessing({ transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID }))
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.INITIALIZING_ANALYZER])
      .next()
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, logMessage))
      .next()
      .put(transactionInfoActions.fetchTransactionInfo())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_TRANSACTION_INFO])
      .next()
      .put(structLogsActions.startPreparingStructlogs())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.PREPARING_STRUCTLOGS])
      .next()
      .put(structLogsActions.fetchStructlogs())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS])
      .next()
      .put(analyzerActions.gatherContractsInformations())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.GATHERING_CONTRACTS_INFORMATION])
      .next()
      .put(bytecodesActions.fetchBytecodes())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_BYTECODES])
      .next()
      .put(sourceCodesActions.startPoolingSources())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_SOURCE_CODES])
      .next()
      .put(analyzerActions.runAnalyzer())
      .next()
      .take(processTransactionTakesMatchers[AnalyzerStages.RUNNING_ANALYZER])
      .next()
      .isDone()
  })
})
