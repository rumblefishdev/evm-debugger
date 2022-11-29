import { ethers } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
import { TTransactionInfo } from '@evm-debuger/types'
import { writeFileSync, mkdirSync } from 'fs'
import { ICallTypeStructLogs, ICreateTypeStructLogs, IFilteredStructLog, IReturnTypeStructLogs, IStructLog } from '@evm-debuger/types'
import { ICallTypeTraceLog, ICreateTypeTraceLog, IReturnTypeTraceLog, IStopTypeTraceLog, TReturnedTraceLog } from '@evm-debuger/types'
import { BuiltinErrors, OpcodesNamesArray } from '../constants/constants'

export const getBaseStructLogs = (structLogs: IStructLog[]) => {
    const indexes: number[] = []

    const filteredLogs = structLogs.filter((e, index) => {
        const { op } = e

        const isBaseLog = OpcodesNamesArray.includes(op)

        if (isBaseLog) {
            indexes.push(index)
        }

        return isBaseLog
    })

    return filteredLogs.map((item) => ({ ...item, index: indexes.shift() })) as IFilteredStructLog[]
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
    const start = parseInt(rawStart, 16)
    const length = parseInt(rawLength, 16)

    const memoryString = memory.join('')

    const readStartIndex = start * 2
    const readEndIndex = readStartIndex + length * 2

    return memoryString.slice(readStartIndex, readEndIndex)
}

export const chceckIfOfCallType = (item: TReturnedTraceLog | IFilteredStructLog): item is ICallTypeTraceLog | ICallTypeStructLogs => {
    if ('type' in item) {
        return item.type === 'CALL' || item.type === 'CALLCODE' || item.type === 'DELEGATECALL' || item.type === 'STATICCALL'
    } else {
        return item.op === 'CALL' || item.op === 'CALLCODE' || item.op === 'DELEGATECALL' || item.op === 'STATICCALL'
    }
}

export const checkIfOfCreateType = (item: TReturnedTraceLog | IFilteredStructLog): item is ICreateTypeTraceLog | ICreateTypeStructLogs => {
    if ('type' in item) {
        return item.type === 'CREATE' || item.type === 'CREATE2'
    } else {
        return item.op === 'CREATE' || item.op === 'CREATE2'
    }
}

export const checkIfOfReturnType = (item: TReturnedTraceLog | IFilteredStructLog): item is IReturnTypeTraceLog | IReturnTypeStructLogs => {
    if ('type' in item) {
        return item.type === 'RETURN' || item.type === 'REVERT'
    } else {
        return item.op === 'RETURN' || item.op === 'REVERT'
    }
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

    const selectorSignature = hexlify(bytes.slice(0, 4))

    const builtin = BuiltinErrors[selectorSignature]

    if (builtin) {
        return new ethers.utils.AbiCoder().decode(builtin.inputs, bytes.slice(4))
    }
}

export const dumpResultsToJson = (transactionHash: string, trace: IStructLog[], parsedTrace: TReturnedTraceLog[]) => {
    mkdirSync(`results/${transactionHash}`, { recursive: true })
    writeFileSync(`results/${transactionHash}/trace.json`, JSON.stringify(trace, null, 2))
    writeFileSync(`results/${transactionHash}/parsedTrace.json`, JSON.stringify(parsedTrace, null, 2))
}

export const getLastItemInCallTypeContext = (traceLogs: TReturnedTraceLog[], currentIndex: number, depth: number) => {
    return traceLogs
        .slice(currentIndex)
        .find(
            (iteratedItem) =>
                iteratedItem.depth === depth + 1 &&
                (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP')
        ) as IReturnTypeTraceLog | IStopTypeTraceLog
}

export const convertTxInfoToTraceLog = (firstNestedStructLog: IStructLog, txInfo: TTransactionInfo) => {
    const { to, input, value, blockNumber } = txInfo

    const defaultFields = {
        type: 'CALL',
        depth: 0,
        index: 0,
        startIndex: 1,
        stackTrace: [] as number[],
        input: input.slice(2),
        passedGas: firstNestedStructLog.gas,
        value: ethers.utils.formatEther(value),
        pc: 0,
        gasCost: 0,
        blockNumber,
    } as ICallTypeTraceLog | ICreateTypeTraceLog

    if (to) {
        return { ...defaultFields, address: to } as ICallTypeTraceLog
    }

    return { ...defaultFields, type: 'CREATE' } as ICreateTypeTraceLog
}

export const getCallAndCreateType = (transactionList: TReturnedTraceLog[]) => {
    return transactionList.filter((item) => chceckIfOfCallType(item) || checkIfOfCreateType(item)) as Array<
        ICallTypeTraceLog | ICreateTypeTraceLog
    >
}
