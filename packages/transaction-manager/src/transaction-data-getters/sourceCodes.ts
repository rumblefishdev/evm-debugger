/* eslint-disable import/exports-last */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ChainIds, getBlockchainApiUrl } from '@evm-debuger/config'
import type { TEtherscanContractSourceCodeResp, TEtherscanParsedSourceCode, TSourceMap } from '@evm-debuger/types'
import fetch from 'node-fetch'
import solc from 'solc'

export type TSourceFile = {
  fileName: string
  content: string
}

export type SolcOutput = Record<
  string,
  Record<
    string,
    {
      evm: {
        evm: {
          bytecode: {
            object: string
            opcodes: string
            sourceMap: string
          }
          deployedBytecode: {
            object: string
            opcodes: string
            sourceMap: string
          }
        }
      }
    }
  >
>

const getSourceData = async (chainId: ChainIds, contractAddress: string) => {
  const RESULTS_DIR = join(__dirname, `../../results/persisted/${contractAddress}`)

  const readSourceData: TEtherscanParsedSourceCode = JSON.parse(readFileSync(`${RESULTS_DIR}/sourceCodesResponse.json`, 'utf-8'))

  if (!readSourceData.sources) {
    const { blockchainApiKey, blockchainApiUrl } = getBlockchainApiUrl(chainId)

    const _url = new URL(blockchainApiUrl)
    _url.searchParams.append('module', 'contract')
    _url.searchParams.append('action', 'getsourcecode')
    _url.searchParams.append('address', contractAddress)
    _url.searchParams.append('apikey', 'VTCZHIZD7SD7EP2TMQRDINFV8HWHM243MY')
    const fetchSourceCodesApiEndpoint = _url.toString()
    const response = await fetch(fetchSourceCodesApiEndpoint)

    const data: TEtherscanContractSourceCodeResp = await response.json()
    if (data.status !== '1') {
      throw new Error(`Fetching failed\n: ${JSON.stringify(data, null, 2)}`)
    }
    if (data.result[0].SourceCode === '') {
      throw new Error(`Not verified`)
    }
    const rawSourceCode = data.result[0].SourceCode.replace(/(\r\n)/gm, '').slice(1, -1)
    const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

    writeFileSync(`${RESULTS_DIR}/sourceCodesResponse.json`, JSON.stringify(sourceCodeObj, null, 2), {})

    return sourceCodeObj
  }

  return readSourceData
}

const getContractFiles = async (sourceData: TEtherscanParsedSourceCode, contractAddress: string) => {
  const RESULTS_DIR = join(__dirname, `../../results/persisted/${contractAddress}`)

  const contractFiles = Object.keys(sourceData.sources).map((fileName) => {
    return {
      fileName,
      content: sourceData.sources[fileName].content,
    }
  })

  contractFiles.forEach((file) => {
    writeFileSync(`${RESULTS_DIR}/contractFiles/${file.fileName}`, file.content)
  })

  return contractFiles
}

const getSourceMap = async (files: TSourceFile[]): Promise<TSourceMap[]> => {
  const input = {
    sources: files.reduce((accumulator, current, index) => {
      const key: string = current.fileName
      return {
        ...accumulator,
        [key]: {
          content: current.content,
        },
      }
    }, {}),
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
      optimizer: {
        runs: 2000,
        enabled: true,
      },
    },
    language: 'Solidity',
  }
  const output: SolcOutput = JSON.parse(solc.compile(JSON.stringify(input))) as SolcOutput

  let allEntries: TSourceMap[] = []
  for (const [fileName, fileInternals] of Object.entries(output.contracts)) {
    const newerEntries: TSourceMap[] = await Promise.all(
      Object.entries(fileInternals).map(([contractName, contractInternals]) => {
        return {
          fileName,
          deployedBytecode: {
            sourceMap: contractInternals.evm.deployedBytecode.sourceMap,
            opcodes: contractInternals.evm.deployedBytecode.opcodes,
            object: contractInternals.evm.deployedBytecode.object,
          },
          contractName,
          bytecode: {
            sourceMap: contractInternals.evm.bytecode.sourceMap,
            opcodes: contractInternals.evm.bytecode.opcodes,
            object: contractInternals.evm.bytecode.object,
          },
        }
      }),
    )
    allEntries = [...allEntries, ...newerEntries]
  }
  return allEntries
}

export const fetchSourceCodes = async (chainId: ChainIds, contractAddress: string) => {
  const RESULTS_DIR = join(__dirname, `../../results/persisted/${contractAddress}`)

  try {
    const sourceData: TEtherscanParsedSourceCode = await getSourceData(chainId, contractAddress)

    const contractFiles = await getContractFiles(sourceData, contractAddress)

    const sourceMap = await getSourceMap(contractFiles)

    writeFileSync(
      `${join(__dirname, '../../results/persisted/0x8db58f141911a07f2d8333dd15eee9511e8985bf2fc255fd84b9e21b7b0c2235')}/sourceMap.json`,
      JSON.stringify(sourceMap, null, 2),
      {},
    )
  } catch (error) {
    console.log(error)
  }
}
;(async () => {
  await fetchSourceCodes(ChainIds.ETHEREUM_MAINNET, '0xbd82Cd2f7C2B8710A879580399CFbfF61c5020B9')
})()
