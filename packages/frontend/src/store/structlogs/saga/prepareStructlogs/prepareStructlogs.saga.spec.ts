import { testSaga } from 'redux-saga-test-plan'
import { ChainId, TransactionTraceResponseStatus } from '@evm-debuger/types'

import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { testLogMessageViaInspect } from '../../../../helpers/sagaTests'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'

import { prepareStructlogs, startPreparingStructlogsSaga } from './prepareStructlogs.saga'

const CHAIN_ID = ChainId.mainnet
const TRANSACTION_HASH = 'transactionHash'
const S3_LOCATION = 's3Location'

describe('startPreparingStructlogsSaga', () => {
  it('should prepare structlogs', () => {
    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.PREPARING_STRUCTLOGS }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.PREPARING_STRUCTLOGS }

    const firstLogMessage = createInfoLogMessage('Preparing structLogs')
    const secondLogMessage = createInfoLogMessage(`Preparing structLogs status: ${TransactionTraceResponseStatus.PENDING}`)
    const thirdLogMessage = createInfoLogMessage(`Preparing structLogs status: ${TransactionTraceResponseStatus.RUNNING}`)
    const fourthLogMessage = createSuccessLogMessage(`Preparing structLogs status: ${TransactionTraceResponseStatus.SUCCESS}`)

    testSaga(startPreparingStructlogsSaga)
      .next()
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, firstLogMessage))
      .next()
      .put(analyzerActions.updateStage(inProgresStage))
      .next()
      .select(transactionConfigSelectors.selectChainId)
      .next(CHAIN_ID)
      .select(transactionConfigSelectors.selectTransactionHash)
      .next(TRANSACTION_HASH)
      .select(transactionConfigSelectors.selectGasUsed)
      .next(BigInt(4444))
      .call(prepareStructlogs, CHAIN_ID, TRANSACTION_HASH, BigInt(4444))
      .next({ status: TransactionTraceResponseStatus.PENDING })
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, secondLogMessage))
      .next()
      .delay(15_000)
      .next()
      .call(prepareStructlogs, CHAIN_ID, TRANSACTION_HASH, BigInt(4444))
      .next({ status: TransactionTraceResponseStatus.RUNNING })
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, thirdLogMessage))
      .next()
      .delay(15_000)
      .next()
      .call(prepareStructlogs, CHAIN_ID, TRANSACTION_HASH, BigInt(4444))
      .next({ status: TransactionTraceResponseStatus.SUCCESS, s3Location: S3_LOCATION })
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, fourthLogMessage))
      .next()
      .put(analyzerActions.updateStage(successStage))
      .next()
      .put(transactionConfigActions.setS3Location({ s3Location: S3_LOCATION }))
      .next()
      .isDone()
  })
})
