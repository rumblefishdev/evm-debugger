import { promises } from 'node:fs'

import type { TTransactionData } from '@evm-debuger/types'
import { SourceFile } from 'hardhat/internal/hardhat-network/stack-traces/model'

import { prepareAnalyzer } from '../scripts/scriptHelper'

import { TxAnalyzer } from './txAnalyzer'

async function runAnalyzerForTestDataFile(tracesPath: string, sourceMaps = {}, sourceCodes = {}, bytecodeMaps = {}) {
  const testData = await promises.readFile(tracesPath, 'utf8')
  const jsonTestData = JSON.parse(testData)

  const transactionData: TTransactionData = {
    transactionInfo: jsonTestData.transactionInfo,
    structLogs: jsonTestData.structLogs,
    sourceMaps,
    sourceCodes,
    contractNames: {},
    bytecodeMaps,
    abis: {},
  }

  const analyzer = await prepareAnalyzer(transactionData)

  return analyzer.analyze()
}

describe('TxAnalyzer', () => {
  describe('analyze transaction', () => {
    beforeAll(() => {
      jest.setTimeout(20_000)
    })

    it('analyzes simple mint transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/simpleMintTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyze transaction with revert', async () => {
      const result = await runAnalyzerForTestDataFile('./test/revertedTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyzes failed transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyzes failed transaction with extended errors', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs2.json')
      expect(result).toMatchSnapshot()
    })

    it('Transaction with empty struct log', async () => {
      await expect(runAnalyzerForTestDataFile('./test/transactionWithEmptyStructLogs.json')).rejects.toThrow(
        'Too primitive transaction without stack calls.',
      )
    })

    it('analyzes transaction with invalid function with the same sighash as cached abis', async () => {
      // Analyzer is trying 1st decode using cached ABIs. In this tx 'transferFrom' have not standard(erc20) output.
      const result = await runAnalyzerForTestDataFile('./test/txWithInvalidOutputToDecode.json')
      expect(result).toMatchSnapshot()
    })

    it('analyze transaction with contract deployment', async () => {
      const result = await runAnalyzerForTestDataFile('./test/createContract.json')
      expect(result).toMatchSnapshot()
    })
  })

  describe('analyze source maps', () => {
    it('analyzes simple source map', async () => {
      const sourceFilesPath = {
        UQ112x112: './test/contracts/libraries/UQ112x112.sol',
        UniswapV2Pair: './test/contracts/UniswapV2Pair.sol',
        UniswapV2ERC20: './test/contracts/UniswapV2ERC20.sol',
        SafeMath: './test/contracts/libraries/SafeMath.sol',
        Math: './test/contracts/libraries/Math.sol',
        IUniswapV2Pair: './test/contracts/interfaces/IUniswapV2Pair.sol',
        IUniswapV2Factory: './test/contracts/interfaces/IUniswapV2Factory.sol',
        IUniswapV2ERC20: './test/contracts/interfaces/IUniswapV2ERC20.sol',
        IUniswapV2Callee: './test/contracts/interfaces/IUniswapV2Callee.sol',
        IERC20: './test/contracts/interfaces/IERC20.sol',
      }

      const fileToRawSourceMap = Object.fromEntries(
        Object.entries(sourceFilesPath).map(([fileName, filePath]) => {
          const fileRawSource = promises.readFile(filePath, 'utf8')
          return [fileName, fileRawSource]
        }),
      )

      await Promise.all(Object.values(fileToRawSourceMap))

      const fileIdToSourceFileMap = {
        '0x153f2044feace1eb377c6e1cf644d12677bd86fd': fileToRawSourceMap,
      }
      const bytecodeFilePath = './test/bytecode/0x153f2044feace1eb377c6e1cf644d12677bd86fd'

      const bytecode = await promises.readFile(bytecodeFilePath, 'utf8')

      const bytecodeMap = {
        '0x153f2044feace1eb377c6e1cf644d12677bd86fd': bytecode,
      }

      const sourceMap =
        '140:866:0:-:0;;;270:238;;;;;;;;;;;;;;;;;;;;;:::i;:::-;357:11;339:15;:29;318:111;;;;;;;;;;;;:::i;:::-;;;;;;;;;453:11;440:10;:24;;;;490:10;474:5;;:27;;;;;;;;;;;;;;;;;;270:238;140:866;;88:117:1;197:1;194;187:12;334:77;371:7;400:5;389:16;;334:77;;;:::o;417:122::-;490:24;508:5;490:24;:::i;:::-;483:5;480:35;470:63;;529:1;526;519:12;470:63;417:122;:::o;545:143::-;602:5;633:6;627:13;618:22;;649:33;676:5;649:33;:::i;:::-;545:143;;;;:::o;694:351::-;764:6;813:2;801:9;792:7;788:23;784:32;781:119;;;819:79;;:::i;:::-;781:119;939:1;964:64;1020:7;1011:6;1000:9;996:22;964:64;:::i;:::-;954:74;;910:128;694:351;;;;:::o;1051:169::-;1135:11;1169:6;1164:3;1157:19;1209:4;1204:3;1200:14;1185:29;;1051:169;;;;:::o;1226:222::-;1366:34;1362:1;1354:6;1350:14;1343:58;1435:5;1430:2;1422:6;1418:15;1411:30;1226:222;:::o;1454:366::-;1596:3;1617:67;1681:2;1676:3;1617:67;:::i;:::-;1610:74;;1693:93;1782:3;1693:93;:::i;:::-;1811:2;1806:3;1802:12;1795:19;;1454:366;;;:::o;1826:419::-;1992:4;2030:2;2019:9;2015:18;2007:26;;2079:9;2073:4;2069:20;2065:1;2054:9;2050:17;2043:47;2107:131;2233:4;2107:131;:::i;:::-;2099:139;;1826:419;;;:::o;140:866:0:-;;;;;;;'

      const sourceMaps = {
        '0x153f2044feace1eb377c6e1cf644d12677bd86fd': sourceMap,
      }

      const result = await runAnalyzerForTestDataFile(
        './test/simpleMintTransactionLogs.json',
        sourceMaps,
        fileIdToSourceFileMap,
        bytecodeMap,
      )
      expect(result).toMatchSnapshot()
    })
  })
})
