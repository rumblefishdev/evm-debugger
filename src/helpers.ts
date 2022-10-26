import { OpcodesNamesArray } from './opcodes'
import { CallTypeTraceLogs, ReturnedTraceLogs, StructLog, StructLogWithIndex } from './types'

export const filterForBaseLogs = async (structLogs: StructLog[]) => {
    const indexes: number[] = []

    const filteredLogs = structLogs.filter((e, index) => {
        const { op } = e

        const isBaseLog = OpcodesNamesArray.includes(op)

        if (isBaseLog) {
            indexes.push(index)
        }

        return isBaseLog
    })

    return filteredLogs.map((item) => ({ ...item, index: indexes.shift() })) as StructLogWithIndex[]
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
    const start = parseInt(rawStart, 16)
    const length = parseInt(rawLength, 16)

    const memoryString = memory.join('')

    const readStartIndex = start * 2
    const readEndIndex = readStartIndex + length * 2

    return memoryString.slice(readStartIndex, readEndIndex)
}

export const chceckIfOfCallType = (type: ReturnedTraceLogs): type is CallTypeTraceLogs => {
    return (
        (type as CallTypeTraceLogs).type === 'CALL' ||
        (type as CallTypeTraceLogs).type === 'CALLCODE' ||
        (type as CallTypeTraceLogs).type === 'DELEGATECALL' ||
        (type as CallTypeTraceLogs).type === 'STATICCALL'
    )
}
