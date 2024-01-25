import type { ChainIds } from '@evm-debuger/config'
import { getBlockchainApiUrl } from '@evm-debuger/config'
import type { TEtherscanContractSourceCodeResp, TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { checkIfPathExists, readFromFile, saveToFile } from '../utils'

export const fetchSourceCodes = async (contractAddress: string, chainId: ChainIds): Promise<TEtherscanContractSourceCodeResp> => {
  const { blockchainApiKey, blockchainApiUrl } = getBlockchainApiUrl(chainId)

  const baseBlokchainApiEndpointUrl = new URL(blockchainApiUrl)
  baseBlokchainApiEndpointUrl.searchParams.append('module', 'contract')
  baseBlokchainApiEndpointUrl.searchParams.append('action', 'getsourcecode')
  baseBlokchainApiEndpointUrl.searchParams.append('address', contractAddress)
  baseBlokchainApiEndpointUrl.searchParams.append('apikey', blockchainApiKey)
  const fetchSourceCodesApiEndpoint = baseBlokchainApiEndpointUrl.toString()

  const response = await fetch(fetchSourceCodesApiEndpoint)

  const sourceCodes: TEtherscanContractSourceCodeResp = await response.json()

  return sourceCodes
}

export const handleSourceCodesFetching = async (
  contractAddress: string,
  chainId: ChainIds,
  path: string,
): Promise<TEtherscanContractSourceCodeResult> => {
  try {
    const isFileExists = checkIfPathExists(path)

    if (isFileExists) {
      return readFromFile<TEtherscanContractSourceCodeResult>(path)
    }

    const sourceCodesResponse = await fetchSourceCodes(contractAddress, chainId)
    const sourceCodesData = sourceCodesResponse.result[0]
    saveToFile(path, sourceCodesData)

    return sourceCodesData
  } catch (error) {
    console.log(error)
  }
}
