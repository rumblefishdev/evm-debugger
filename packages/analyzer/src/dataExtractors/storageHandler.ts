import type {
  ICallTypeTraceLog,
  ICreateTypeTraceLog,
  IStorageTypeStructLogs,
  IStructLog,
  TStorage,
} from '@evm-debuger/types'

export class StorageHandler {

  public parseTraceLog(traceLog: ICallTypeTraceLog | ICreateTypeTraceLog, structLogs: IStructLog[]) {
    const { returnIndex, isSuccess } = traceLog

    const callContextStructLogs = this.getCallContextStructLogs(traceLog, structLogs)
    const storageLogs = this.extractStorageLogs(callContextStructLogs, traceLog)

    const { loadedStorage, changedStorage } = this.getLoadedAndChangedStorage(storageLogs);

    const storageData = structLogs[returnIndex].storage
    let returnedStorage =  this.mapStorageData(storageData)

    if (!isSuccess) returnedStorage = loadedStorage

    return { returnedStorage, loadedStorage, changedStorage }
  }

  private getLoadedAndChangedStorage(storageLogs: IStorageTypeStructLogs[]) {
    const loadedStorage = []
    const changedStorage = []
    storageLogs.forEach((element, rootIndex) => {
      const loadStorageElement = this.getLoadStorageElement(element)
      if (loadStorageElement) loadedStorage.push(loadStorageElement)

      const previousStructLog = storageLogs[rootIndex - 1];
      const changeStorageElement = this.getChangeStorageElement(element, previousStructLog)
      if (changeStorageElement) changedStorage.push(changeStorageElement)
    })

    return { loadedStorage, changedStorage }
  }

  private getCallContextStructLogs(traceLog: ICallTypeTraceLog | ICreateTypeTraceLog, structLogs: IStructLog[]) {
    const { startIndex, returnIndex, depth } = traceLog
    return structLogs.slice(startIndex, returnIndex).filter((item) => item.depth === depth + 1)
  }

  private extractStorageLogs(callContextStructLogs: IStructLog[], traceLog: ICallTypeTraceLog | ICreateTypeTraceLog) {
    return callContextStructLogs
        .map((log, index) => {
          const isStorage = log.op === 'SSTORE' || log.op === 'SLOAD'
          if (isStorage) return { ...log, index: traceLog.index + index }
          return null
        })
        .filter(log => log !== null) as IStorageTypeStructLogs[]
  }

  private getLoadStorageElement(log: IStorageTypeStructLogs) {
    const { op, stack, storage, index } = log

    if (op === 'SLOAD') {
      const key = stack.at(-1)
      return { value: storage[key], key, index }
    }
  }

  private getChangeStorageElement(item: IStorageTypeStructLogs, previousStructLog: IStorageTypeStructLogs) {
    const { op, stack, index } = item

    if (op === 'SSTORE') {
      const key = stack.at(-1)
      const value = stack.at(-2)
      const initialValue = previousStructLog.storage[key]

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