import type { TIndexedStructLog, TStorage, TTraceLog } from '@evm-debuger/types'

import {
  checkOpcodeIfOfCallOrStaticType,
  checkOpcodeIfOfCreateGroupType,
  checkOpcodeIfOfDelegateCallType,
} from '../helpers/structLogTypeGuards'

export class StorageHandler {
  public getParsedStorageLogs(traceLog: TTraceLog, structLogs: TIndexedStructLog[]) {
    const { returnIndex, isSuccess, index } = traceLog

    const callContextStructLogs = this.getCallContextStructLogs(traceLog, structLogs)
    const storageLogs = this.extractStorageLogs(callContextStructLogs, index)

    const { loadedStorage, changedStorage } = this.getLoadedAndChangedStorage(storageLogs)

    const storageData = typeof returnIndex === 'number' ? structLogs[returnIndex]?.storage || {} : {}
    let returnedStorage = this.mapStorageData(storageData)

    if (!isSuccess) returnedStorage = loadedStorage

    return { returnedStorage, loadedStorage, changedStorage }
  }

  public resolveStorageAddress(traceLog: TTraceLog, previousTransactionLog: TTraceLog) {
    if (checkOpcodeIfOfDelegateCallType(traceLog.op)) return previousTransactionLog.address
    if (checkOpcodeIfOfCallOrStaticType(traceLog.op)) return traceLog.address
    if (checkOpcodeIfOfCreateGroupType(traceLog.op)) return traceLog.address
  }

  private getLoadedAndChangedStorage(storageLogs: TIndexedStructLog[]) {
    const loadedStorage = []
    const changedStorage = []
    storageLogs.forEach((element, rootIndex) => {
      const loadStorageElement = this.getLoadStorageElement(element)
      if (loadStorageElement) loadedStorage.push(loadStorageElement)

      const previousStructLog = storageLogs[rootIndex - 1]
      const changeStorageElement = this.getChangeStorageElement(element, previousStructLog)
      if (changeStorageElement) changedStorage.push(changeStorageElement)
    })

    return { loadedStorage, changedStorage }
  }

  private getCallContextStructLogs(traceLog: TTraceLog, structLogs: TIndexedStructLog[]) {
    const { startIndex, returnIndex, depth } = traceLog
    return structLogs.slice(startIndex, returnIndex).filter((item) => item.depth === depth + 1)
  }

  private extractStorageLogs(callContextStructLogs: TIndexedStructLog[], traceLogIndex: number) {
    const storageLogs = []
    callContextStructLogs.forEach((log, index) => {
      const isStorage = log.op === 'SSTORE' || log.op === 'SLOAD'
      if (isStorage) storageLogs.push({ ...log, index: traceLogIndex + index })
    })

    return storageLogs
  }

  private getLoadStorageElement(log: TIndexedStructLog) {
    const { op, stack, storage, index } = log

    if (op === 'SLOAD') {
      const key = stack.at(-1)
      return { value: storage[key], key, index }
    }
  }

  private getChangeStorageElement(item: TIndexedStructLog, previousStructLog: TIndexedStructLog) {
    const { op, stack, index } = item

    if (op === 'SSTORE') {
      const key = stack.at(-1)
      const value = stack.at(-2)
      const initialValue = previousStructLog ? previousStructLog.storage[key] : 'unknown'

      return { updatedValue: value, key, initialValue, index }
    }
  }

  private mapStorageData(storageData: TStorage) {
    const keys = Object.keys(storageData)

    return keys.map((item) => {
      return { value: storageData[item], key: item }
    })
  }
}
