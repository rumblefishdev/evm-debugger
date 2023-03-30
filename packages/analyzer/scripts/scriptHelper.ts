import fetch from 'node-fetch'
import { TxAnalyzer } from '../src'
import { TTransactionData } from '@evm-debuger/types'
import { ethers } from 'ethers'

export const prepareAnalyzer = async (transactionData: TTransactionData) => {
  const analyzerForAddressesTranslation = new TxAnalyzer(transactionData)
  const transactionalDataWithTranslatedAddresses =
    await getTransactionDataWithTranslatedAddresses(
      analyzerForAddressesTranslation,
    )

  return new TxAnalyzer(transactionalDataWithTranslatedAddresses)
}

const getTransactionDataWithTranslatedAddresses = async (
  analyzer: TxAnalyzer,
) => {
  const addresses = analyzer.getContractAddressesInTransaction()
  for (const address of addresses) {
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`,
    )

    const { result, status } = await response.json()
    if (status === '1') {
      analyzer.transactionData.abis[address] = JSON.parse(result[0].ABI)
      analyzer.transactionData.sourceCodes[address] = result[0].SourceCode
      analyzer.transactionData.contractNames[address] = result[0].ContractName
    }
  }

  return analyzer.transactionData
}
