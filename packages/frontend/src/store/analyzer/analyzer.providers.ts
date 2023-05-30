import type ethers from 'ethers'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { store } from '../store'

import { analyzerActions } from './analyzer.slice'
import type { ISourceProvider, IBytecodeProvider, IStructLogProvider, ITxInfoProvider } from './analyzer.types'
import { uncompressSourcemaps } from './analyzer.utils'

export class StaticStructLogProvider implements IStructLogProvider {
  constructor(private structLog: IStructLog[]) {}

  getStructLog() {
    return Promise.resolve(this.structLog)
  }
}

export class StaticTxInfoProvider implements ITxInfoProvider {
  constructor(private txInfo: TTransactionInfo) {}

  getTxInfo() {
    return Promise.resolve(this.txInfo)
  }
}

export class EtherscanSourceFetcher implements ISourceProvider {
  constructor(private etherscanUrl: string, private etherscanKey: string) {}

  async getSource(address: string) {
    const response = await fetch(
      `${this.etherscanUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.etherscanKey}`,
    )
    if (response.status !== 200) throw new Error(`Etherscan returned ${response.status} response code`)

    const asJson = await response.json()
    if (!asJson.result[0].SourceCode) throw new Error(`${address} is not verified on Etherscan`)

    const rawSourceMap =
      '140:866:0:-:0;;;270:238;;;;;;;;;;;;;;;;;;;;;:::i;:::-;357:11;339:15;:29;318:111;;;;;;;;;;;;:::i;:::-;;;;;;;;;453:11;440:10;:24;;;;490:10;474:5;;:27;;;;;;;;;;;;;;;;;;270:238;140:866;;88:117:1;197:1;194;187:12;334:77;371:7;400:5;389:16;;334:77;;;:::o;417:122::-;490:24;508:5;490:24;:::i;:::-;483:5;480:35;470:63;;529:1;526;519:12;470:63;417:122;:::o;545:143::-;602:5;633:6;627:13;618:22;;649:33;676:5;649:33;:::i;:::-;545:143;;;;:::o;694:351::-;764:6;813:2;801:9;792:7;788:23;784:32;781:119;;;819:79;;:::i;:::-;781:119;939:1;964:64;1020:7;1011:6;1000:9;996:22;964:64;:::i;:::-;954:74;;910:128;694:351;;;;:::o;1051:169::-;1135:11;1169:6;1164:3;1157:19;1209:4;1204:3;1200:14;1185:29;;1051:169;;;;:::o;1226:222::-;1366:34;1362:1;1354:6;1350:14;1343:58;1435:5;1430:2;1422:6;1418:15;1411:30;1226:222;:::o;1454:366::-;1596:3;1617:67;1681:2;1676:3;1617:67;:::i;:::-;1610:74;;1693:93;1782:3;1693:93;:::i;:::-;1811:2;1806:3;1802:12;1795:19;;1454:366;;;:::o;1826:419::-;1992:4;2030:2;2019:9;2015:18;2007:26;;2079:9;2073:4;2069:20;2065:1;2054:9;2050:17;2043:47;2107:131;2233:4;2107:131;:::i;:::-;2099:139;;1826:419;;;:::o;140:866:0:-;;;;;;;'

    const sourceMap = uncompressSourcemaps(rawSourceMap)

    return {
      sourceMap,
      sourceCode: asJson.result[0].SourceCode,
      contractName: asJson.result[0].ContractName,
      abi: JSON.parse(asJson.result[0].ABI),
    }
  }
}

export class TransactionTraceFetcher implements IStructLogProvider {
  constructor(private transactionTraceProviderUrl: string, public hash: string, private chainId: number) {}

  // eslint-disable-next-line id-denylist
  async getStructLog(): Promise<IStructLog[]> {
    return new Promise((resolve, reject) => {
      const transactionTraceInterval = setInterval(async () => {
        const response = await fetch(`${this.transactionTraceProviderUrl}/analyzerData/${this.hash}/${this.chainId}`)
        console.log(response)
        const asJson = await response.json()
        console.log('INVOKE:', asJson)

        store.dispatch(analyzerActions.logMessage(`Fetching structLogs status: ${asJson.status}`))

        if (asJson.status === TransactionTraceResponseStatus.FAILED) {
          clearInterval(transactionTraceInterval)
          reject(`Cannot retrieve data for transaction with hash: ${this.hash}. Reason: ${asJson.errorDetails}`)
        } else if (asJson.status === TransactionTraceResponseStatus.SUCCESS) {
          const transactionTrace = await fetch(`https://${asJson.s3Location}`)

          clearInterval(transactionTraceInterval)
          const parsed = await transactionTrace.json()
          resolve(parsed.structLogs)
        }
      }, 15_000)
    })
  }
}

export class JSONRpcBytecodeFetcher implements IBytecodeProvider {
  constructor(private provider: ethers.providers.JsonRpcProvider) {}

  async getBytecode(address: string): Promise<string | null> {
    return this.provider.getCode(address)
  }
}

export class JSONRpcTxInfoFetcher implements ITxInfoProvider {
  constructor(public hash: string, private provider: ethers.providers.JsonRpcProvider) {}

  private unifyTxInfo(tx: ethers.providers.TransactionResponse): TTransactionInfo {
    return {
      value: tx.value.toHexString(),
      to: tx.to,
      nonce: tx.nonce,
      input: tx.data,
      hash: tx.hash,
      from: tx.from,
      chainId: tx.chainId.toString(),
      blockNumber: tx.blockNumber.toString(),
      blockHash: tx.blockHash,
    }
  }

  async getTxInfo() {
    const tx = await this.provider.getTransaction(this.hash)

    return this.unifyTxInfo(tx)
  }
}
