import { network } from 'hardhat'

import { checkIfPathExists, readFromFile, saveToFile } from '../utils'

export const fetchBytecode = async (contractAddress: string): Promise<{ result: string }> => {
  const bytecode: string = await network.provider.send('eth_getCode', [contractAddress, 'latest'])
  return { result: bytecode }
}

export const handleBytecodeFetching = async (contractAddress: string, path: string): Promise<{ result: string }> => {
  try {
    const isFileExist = checkIfPathExists(path)

    if (isFileExist) {
      return readFromFile<{ result: string }>(path)
    }

    const bytecodeResult = await fetchBytecode(contractAddress)
    saveToFile(path, bytecodeResult)

    return bytecodeResult
  } catch (error) {
    console.log(error)
  }
}
