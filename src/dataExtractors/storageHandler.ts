import { ICallTypeTraceLog, ICreateTypeTraceLog } from '../typings/parsedLogs'
import { IStorageTypeStructLogs, IStructLog } from '../typings/structLogs'
import { TChangedStorage, TDataProvider, TLoadedStorage, TReturnedStorage } from '../typings/types'

export class StorageHandler {
    constructor(private readonly structLogs: IStructLog[], private readonly traceLog: ICallTypeTraceLog | ICreateTypeTraceLog) {}

    private callContextStructLogs: IStructLog[]
    private storageStructLogs: IStorageTypeStructLogs[]

    private loadedStorage: TLoadedStorage = []
    private changedStorage: TChangedStorage = []
    private returnedStorage: TReturnedStorage = []

    private getCallContextStructLogs() {
        const { startIndex, returnIndex, depth } = this.traceLog

        this.callContextStructLogs = this.structLogs.slice(startIndex, returnIndex).filter((item) => item.depth === depth + 1)
    }

    private extractStorageStructLogs() {
        const indexes: number[] = []

        const filteredLogs = this.callContextStructLogs.filter((item, index) => {
            const isStorage = item.op === 'SSTORE' || item.op === 'SLOAD'

            if (isStorage) {
                indexes.push(this.traceLog.index + index)
            }

            return isStorage
        })

        this.storageStructLogs = filteredLogs.map((item, index) => {
            return { ...item, index: indexes[index] }
        }) as IStorageTypeStructLogs[]
    }

    private saveStorageLoad(item: IStorageTypeStructLogs) {
        const { op, stack, storage, index } = item

        if (op === 'SLOAD') {
            const key = stack[stack.length - 1]

            this.loadedStorage.push({ key, value: storage[key], index })
        }
    }

    private saveStorageChange(item: IStorageTypeStructLogs, rootIndex: number) {
        const { op, stack, index } = item

        if (op === 'SSTORE') {
            const key = stack[stack.length - 1]
            const value = stack[stack.length - 2]

            const initialValue = this.storageStructLogs[rootIndex - 1].storage[key]

            this.changedStorage.push({ key, updatedValue: value, initialValue, index })
        }
    }

    private mapStorageData(returnIndex: number) {
        const storageOfReturnItem = this.structLogs[returnIndex].storage

        const keys = Object.keys(storageOfReturnItem)

        this.returnedStorage = keys.map((item) => {
            return { key: item, value: storageOfReturnItem[item] }
        })
    }

    public returnStorageLogs() {
        return { loadedStorage: this.loadedStorage, changedStorage: this.changedStorage, returnedStorage: this.returnedStorage }
    }

    public parseStorageData() {
        const { returnIndex } = this.traceLog

        this.getCallContextStructLogs()
        this.extractStorageStructLogs()

        this.storageStructLogs.forEach((element, rootIndex) => {
            this.saveStorageLoad(element)
            this.saveStorageChange(element, rootIndex)
        })

        if (!returnIndex) {
            return this.traceLog
        }

        this.mapStorageData(returnIndex)
    }

    public returnExpectedStorage() {
        this.returnedStorage = this.loadedStorage
    }
}
