import {
    ICallTypeTraceLogs,
    ICreateTypeTraceLogs,
    IStorageStructLogs,
    IStructLog,
    TChangedStorage,
    TLoadedStorage,
    TReturnedStorage,
} from '../typings/types'

export class StorageHandler {
    constructor(private readonly traceLogs: IStructLog[], private readonly item: ICallTypeTraceLogs | ICreateTypeTraceLogs) {}

    private callContextStorageLogs: IStructLog[]
    private storageTraceLogs: IStorageStructLogs[]

    private loadedStorage: TLoadedStorage = []
    private changedStorage: TChangedStorage = []
    private returnedStorage: TReturnedStorage = []

    private getCallExecutionTraceLogs() {
        const { startIndex, returnIndex } = this.item

        this.callContextStorageLogs = this.traceLogs.slice(startIndex, returnIndex)
    }

    private extractStorageTraceLogs() {
        const indexes: number[] = []

        const filteredLogs = this.callContextStorageLogs.filter((item, index) => {
            const isStorage = item.op === 'SSTORE' || item.op === 'SLOAD'

            if (isStorage) {
                indexes.push(this.item.index + index)
            }

            return isStorage
        })

        this.storageTraceLogs = filteredLogs.map((item, index) => {
            return { ...item, index: indexes[index] }
        }) as IStorageStructLogs[]
    }

    private logStorageLoad(item: IStorageStructLogs) {
        const { op, stack, storage, index } = item

        if (op === 'SLOAD') {
            const key = stack[stack.length - 1]

            this.loadedStorage.push({ key, value: storage[key], index })
        }
    }

    private logStorageChange(item: IStorageStructLogs, rootIndex: number) {
        const { op, stack, index } = item

        if (op === 'SSTORE') {
            const key = stack[stack.length - 1]
            const value = stack[stack.length - 2]

            const initialValue = this.storageTraceLogs[rootIndex - 1].storage[key]

            this.changedStorage.push({ key, updatedValue: value, initialValue, index })
        }
    }

    private mapStorageData(returnIndex: number) {
        const storageOfReturnItem = this.traceLogs[returnIndex].storage

        const keys = Object.keys(storageOfReturnItem)

        this.returnedStorage = keys.map((item) => {
            return { key: item, value: storageOfReturnItem[item] }
        })
    }

    private returnStorageLogs() {
        return { loadedStorage: this.loadedStorage, changedStorage: this.changedStorage, returnedStorage: this.returnedStorage }
    }

    public extractStorageData() {
        const { returnIndex } = this.item

        this.getCallExecutionTraceLogs()
        this.extractStorageTraceLogs()

        this.storageTraceLogs.forEach((element, rootIndex) => {
            this.logStorageLoad(element)
            this.logStorageChange(element, rootIndex)
        })

        if (!returnIndex) {
            return this.item
        }

        this.mapStorageData(returnIndex)

        return { ...this.item, storageLogs: this.returnStorageLogs() }
    }
}
