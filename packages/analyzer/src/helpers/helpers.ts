/* eslint-disable sonarjs/cognitive-complexity */
import { ethers } from 'ethers'
import type {
  ICallTypeStructLogs,
  ICallTypeTraceLog,
  ICreateTypeStructLogs,
  ICreateTypeTraceLog,
  IFilteredStructLog,
  ILogTypeStructLogs,
  IReturnTypeStructLogs,
  IReturnTypeTraceLog,
  IStopTypeTraceLog,
  IStructLog,
  TMainTraceLogs,
  TParseSourceCodeOutput,
  TReturnedTraceLog,
  TSourceCodeObject,
  TTransactionInfo,
} from '@evm-debuger/types'

import { BuiltinErrors, OpcodesNamesArray } from '../constants/constants'

export const getFilteredStructLogs = (structLogs: IStructLog[]): IFilteredStructLog[] => {
  const filteredLogs = []
  structLogs.forEach((log, index) => {
    const { op } = log
    if (OpcodesNamesArray.includes(op)) filteredLogs.push({ ...log, index })
  })

  return filteredLogs
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
  const start = Number.parseInt(rawStart, 16)
  const length = Number.parseInt(rawLength, 16)

  const memoryString = memory.join('')

  const readStartIndex = start * 2
  const readEndIndex = readStartIndex + length * 2

  return memoryString.slice(readStartIndex, readEndIndex)
}

export const checkIfOfCallType = (item: TReturnedTraceLog | Omit<IStructLog, 'stack'>): item is ICallTypeTraceLog | ICallTypeStructLogs => {
  if ('type' in item) return item.type === 'CALL' || item.type === 'CALLCODE' || item.type === 'DELEGATECALL' || item.type === 'STATICCALL'

  return item.op === 'CALL' || item.op === 'CALLCODE' || item.op === 'DELEGATECALL' || item.op === 'STATICCALL'
}

export const checkIfOfCreateType = (
  item: TReturnedTraceLog | Omit<IStructLog, 'stack'>,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'CREATE' || item.type === 'CREATE2'

  return item.op === 'CREATE' || item.op === 'CREATE2'
}

export const checkIfOfCreateOrCallType = (item: TReturnedTraceLog | Omit<IStructLog, 'stack'>): item is TMainTraceLogs => {
  return checkIfOfCallType(item) || checkIfOfCreateType(item)
}

export const checkIfOfDelegateCallType = (
  item: TReturnedTraceLog | IFilteredStructLog,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'DELEGATECALL'

  return item.op === 'DELEGATECALL'
}

export const checkIfOfCallOrStaticCallType = (
  item: TReturnedTraceLog | IFilteredStructLog,
): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
  if ('type' in item) return item.type === 'CALL' || item.type === 'STATICCALL'

  return item.op === 'CALL' || item.op === 'STATICCALL'
}

export const checkIfOfReturnType = (item: TReturnedTraceLog | IFilteredStructLog): item is IReturnTypeTraceLog | IReturnTypeStructLogs => {
  if ('type' in item) return item.type === 'RETURN' || item.type === 'REVERT'

  return item.op === 'RETURN' || item.op === 'REVERT'
}

export const isLogType = (item: IStructLog): item is ILogTypeStructLogs => {
  return item.op === 'LOG0' || item.op === 'LOG1' || item.op === 'LOG2' || item.op === 'LOG3' || item.op === 'LOG4'
}

export const safeJsonParse = (text: string): any | null => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export const getSafeHex = (value: string | undefined) => (value ? `0x${value}` : `0x`)

export const decodeErrorResult = (data: ethers.utils.BytesLike) => {
  const bytes = ethers.utils.arrayify(data)

  const selectorSignature = ethers.utils.hexlify(bytes.slice(0, 4))

  const builtin = BuiltinErrors[selectorSignature]

  if (builtin) return new ethers.utils.AbiCoder().decode(builtin.inputs, bytes.slice(4))
}

export const prepareTraceToSearch = (
  logs: TReturnedTraceLog[] | IStructLog[],
  currentIndex: number,
  depth: number,
  inclusiveLastElement: boolean,
) => {
  const slicedTraceLogs = logs.slice(currentIndex + 1)
  let maxLastCallIndex = slicedTraceLogs.findIndex((log) => log.depth === depth)
  maxLastCallIndex = inclusiveLastElement ? maxLastCallIndex + 1 : maxLastCallIndex
  return maxLastCallIndex === -1 ? slicedTraceLogs : slicedTraceLogs.slice(0, maxLastCallIndex)
}

export const getNextItemOnSameDepth = (traceLogs: IStructLog[], currentIndex: number, depth: number): IStructLog => {
  const traceToSearch = prepareTraceToSearch(traceLogs, currentIndex, depth, true)
  return traceToSearch.at(-1) as IStructLog
}

export const getLastItemInCallTypeContext = (traceLogs: TReturnedTraceLog[], currentIndex: number, depth: number) => {
  const traceToSearch = prepareTraceToSearch(traceLogs, currentIndex, depth, false) as TReturnedTraceLog[]

  return traceToSearch.find(
    (iteratedItem) =>
      iteratedItem.depth === depth + 1 &&
      (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP'),
  ) as IReturnTypeTraceLog | IStopTypeTraceLog
}

export const getLastLogWithRevertType = (traceToSearch: TReturnedTraceLog[], depth: number) => {
  return traceToSearch.find((iteratedItem) => iteratedItem.depth === depth + 1 && iteratedItem.type === 'REVERT') as IReturnTypeTraceLog
}

export const getStorageAddressFromTransactionInfo = (txInfo: TTransactionInfo) => {
  const { nonce, to, from } = txInfo
  return to || ethers.utils.getContractAddress({ nonce, from })
}

export const convertTxInfoToTraceLog = (firstNestedStructLog: IStructLog, txInfo: TTransactionInfo) => {
  const { to, input, value, blockNumber } = txInfo

  const storageAddress = getStorageAddressFromTransactionInfo(txInfo)

  const defaultFields = {
    value: ethers.utils.formatEther(value),
    type: 'CALL',
    storageAddress,
    startIndex: 0,
    stackTrace: [] as number[],
    pc: 0,
    passedGas: firstNestedStructLog.gas,
    input,
    index: 0,
    gasCost: 0,
    depth: 0,
    blockNumber,
  } as ICallTypeTraceLog | ICreateTypeTraceLog

  if (to)
    return {
      ...defaultFields,
      address: to.toLowerCase(),
    } as ICallTypeTraceLog

  return {
    ...defaultFields,
    type: 'CREATE',
  } as ICreateTypeTraceLog
}

export const isMultipleFilesJSON = (sourceCode: string) => sourceCode.startsWith('{{') && sourceCode.endsWith('}}')

export const removeEncapsulation = (sourceCode: string) => {
  return sourceCode.slice(1, -1).replace(/"/g, "'")
}
// TODO: remove this trick after demo
export const predefinedOrderForContract = [
  '@openzeppelin/contracts/access/Ownable.sol',
  '@openzeppelin/contracts/interfaces/IERC1967.sol',
  '@openzeppelin/contracts/interfaces/draft-IERC1822.sol',
  '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol',
  '@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol',
  '@openzeppelin/contracts/proxy/Proxy.sol',
  '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol',
  '@openzeppelin/contracts/proxy/beacon/IBeacon.sol',
  '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol',
  '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol',
  '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol',
  '@openzeppelin/contracts/utils/Address.sol',
  '@openzeppelin/contracts/utils/Context.sol',
  '@openzeppelin/contracts/utils/StorageSlot.sol',
]

export const parseSourceCode = (sourceName: string, sourceCode: string, shouldSortPredefined = false): TParseSourceCodeOutput => {
  if (isMultipleFilesJSON(sourceCode)) {
    const contractsInfo: TSourceCodeObject = JSON.parse(sourceCode.slice(1, -1))

    let sources = Object.entries(contractsInfo.sources).sort(([aName], [bName]) => {
      const aNamePrepared = aName.split('/').slice(0, -1).join('').toLocaleLowerCase()
      const bNamePrepared = bName.split('/').slice(0, -1).join('').toLocaleLowerCase()
      return aNamePrepared.localeCompare(bNamePrepared, undefined, { sensitivity: 'base' })
    })

    if (shouldSortPredefined) {
      console.log('shouldSortPredefined', shouldSortPredefined)
      const test = Object.fromEntries(predefinedOrderForContract.map((predefinedSource) => [predefinedSource, { content: '' }]))

      sources.forEach(([sourceName2, sourceDetails]) => {
        test[sourceName2] = sourceDetails
      })

      sources = Object.entries(test)
    }

    console.log('sources', sources)

    return Object.fromEntries(
      sources.map(([contractName, contractDetails], index) => {
        return [
          index,
          {
            sourceName: contractName,
            content: removeEncapsulation(contractDetails.content),
          },
        ]
      }),
    )
  }
  return { 0: { sourceName, content: sourceCode } }
}
