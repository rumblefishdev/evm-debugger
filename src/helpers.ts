import { OpcodesNamesArray } from './opcodes'
import { ICallTypeTraceLogs, TReturnedTraceLogs, IStructLog, IStructLogWithIndex } from './types'

export const filterForBaseLogs = async (structLogs: IStructLog[]) => {
    const indexes: number[] = []

    const filteredLogs = structLogs.filter((e, index) => {
        const { op } = e

        const isBaseLog = OpcodesNamesArray.includes(op)

        if (isBaseLog) {
            indexes.push(index)
        }

        return isBaseLog
    })

    return filteredLogs.map((item) => ({ ...item, index: indexes.shift() })) as IStructLogWithIndex[]
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
    const start = parseInt(rawStart, 16)
    const length = parseInt(rawLength, 16)

    const memoryString = memory.join('')

    const readStartIndex = start * 2
    const readEndIndex = readStartIndex + length * 2

    return memoryString.slice(readStartIndex, readEndIndex)
}

export const chceckIfOfCallType = (type: TReturnedTraceLogs): type is ICallTypeTraceLogs => {
    return (
        (type as ICallTypeTraceLogs).type === 'CALL' ||
        (type as ICallTypeTraceLogs).type === 'CALLCODE' ||
        (type as ICallTypeTraceLogs).type === 'DELEGATECALL' ||
        (type as ICallTypeTraceLogs).type === 'STATICCALL'
    )
}

export const safeJsonParse = (text: string): any | null => {
    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}
