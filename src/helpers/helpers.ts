import { ethers } from 'ethers'
import { hexlify } from 'ethers/lib/utils'
import { OpcodesNamesArray } from '../typings/opcodes'
import { ICallTypeTraceLogs, TReturnedTraceLogs, IStructLog, IStructLogWithIndex, ICreateTypeTraceLogs } from '../typings/types'
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

export const checkIfOfCreateType = (type: TReturnedTraceLogs): type is ICreateTypeTraceLogs => {
    return (type as ICreateTypeTraceLogs).type === 'CREATE' || (type as ICreateTypeTraceLogs).type === 'CREATE2'
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
