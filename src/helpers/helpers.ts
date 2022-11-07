import { ethers } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
import { OpcodesNamesArray } from '../typings/opcodes'
import {
    ICallTypeTraceLogs,
    TReturnedTraceLogs,
    IStructLog,
    IBaseStructLog,
    ICreateTypeTraceLogs,
    IReturnTypeTraceLogs,
    ICallStructLogs,
    ICreateStructLogs,
    IReturnStructLogs,
    IStopTypeTraceLogs,
    TTransactionRootLog,
} from '../typings/types'
import { writeFileSync, mkdirSync } from 'fs'

export const filterForBaseLogs = (structLogs: IStructLog[]) => {
    const indexes: number[] = []

    const filteredLogs = structLogs.filter((e, index) => {
        const { op } = e

        const isBaseLog = OpcodesNamesArray.includes(op)

        if (isBaseLog) {
            indexes.push(index)
        }

        return isBaseLog
    })

    return filteredLogs.map((item) => ({ ...item, index: indexes.shift() })) as IBaseStructLog[]
}

export const readMemory = (memory: string[], rawStart: string, rawLength: string): string => {
    const start = parseInt(rawStart, 16)
    const length = parseInt(rawLength, 16)

    const memoryString = memory.join('')

    const readStartIndex = start * 2
    const readEndIndex = readStartIndex + length * 2

    return memoryString.slice(readStartIndex, readEndIndex)
}

export const chceckIfOfCallType = (item: TReturnedTraceLogs | IBaseStructLog): item is ICallTypeTraceLogs | ICallStructLogs => {
    if ('type' in item) {
        return item.type === 'CALL' || item.type === 'CALLCODE' || item.type === 'DELEGATECALL' || item.type === 'STATICCALL'
    } else {
        return item.op === 'CALL' || item.op === 'CALLCODE' || item.op === 'DELEGATECALL' || item.op === 'STATICCALL'
    }
}

export const checkIfOfCreateType = (item: TReturnedTraceLogs | IBaseStructLog): item is ICreateTypeTraceLogs | ICreateStructLogs => {
    if ('type' in item) {
        return item.type === 'CREATE' || item.type === 'CREATE2'
    } else {
        return item.op === 'CREATE' || item.op === 'CREATE2'
    }
}

export const checkIfOfReturnType = (item: TReturnedTraceLogs | IBaseStructLog): item is IReturnTypeTraceLogs | IReturnStructLogs => {
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

const BuiltinErrors: Record<string, { signature: string; inputs: Array<string>; name: string; reason?: boolean }> = {
    '0x08c379a0': { signature: 'Error(string)', name: 'Error', inputs: ['string'], reason: true },
    '0x4e487b71': { signature: 'Panic(uint256)', name: 'Panic', inputs: ['uint256'] },
}

export const decodeErrorResult = (data: ethers.utils.BytesLike) => {
    const bytes = ethers.utils.arrayify(data)

    const selectorSignature = hexlify(bytes.slice(0, 4))

    const builtin = BuiltinErrors[selectorSignature]

    if (builtin) {
        return new ethers.utils.AbiCoder().decode(builtin.inputs, bytes.slice(4))
    }
}

export const dumpResultsToJson = (transactionHash: string, trace: IStructLog[], parsedTrace: TReturnedTraceLogs[]) => {
    mkdirSync(`results/${transactionHash}`, { recursive: true })
    writeFileSync(`results//${transactionHash}/trace.json`, JSON.stringify(trace, null, 2))
    writeFileSync(`results//${transactionHash}/parsedTrace.json`, JSON.stringify(parsedTrace, null, 2))
}

export const getLastItemInCallContext = (traceLogs: TReturnedTraceLogs[], currentIndex: number, depth) => {
    return traceLogs
        .slice(currentIndex)
        .find(
            (iteratedItem) =>
                iteratedItem.depth === depth + 1 &&
                (iteratedItem.type === 'RETURN' || iteratedItem.type === 'REVERT' || iteratedItem.type === 'STOP')
        ) as IReturnTypeTraceLogs | IStopTypeTraceLogs
}

export const convertRootLogsToTraceLogs = (firstNestedItem: IStructLog, rootLogs: TTransactionRootLog) => {
    const { to, input, value } = rootLogs

    const defaultFields = {
        type: 'CALL',
        depth: 0,
        index: 0,
        startIndex: 1,
        stackTrace: [] as number[],
        input: input.slice(2),
        passedGas: firstNestedItem.gas,
        value: ethers.utils.formatEther(value),
        pc: 0,
        gasCost: 0,
    } as ICallTypeTraceLogs | ICreateTypeTraceLogs

    if (to) {
        return { ...defaultFields, address: to } as ICallTypeTraceLogs
    }

    return { ...defaultFields, type: 'CREATE' } as ICreateTypeTraceLogs
}

export const filterCallAndCreateType = (transactionList: TReturnedTraceLogs[]) => {
    return transactionList.filter((item) => chceckIfOfCallType(item) || checkIfOfCreateType(item)) as Array<
        ICallTypeTraceLogs | ICreateTypeTraceLogs
    >
}
