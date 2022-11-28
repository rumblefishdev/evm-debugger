import { TCallTypeOpcodes, TCreateTypeOpcodes, TReturnTypeOpcodes, TStorageOpCodes } from './opcodes'
import { TAllOpCodes } from './opcodesNames'
import { TStorage } from './types'

export interface IStructLog {
    pc: number
    op: TAllOpCodes
    gas: number
    gasCost: number
    depth: number
    stack: string[]
    memory: string[]
    storage: TStorage
}

export interface IFilteredStructLog extends IStructLog {
    index: number
    op: TCallTypeOpcodes | TCreateTypeOpcodes | TReturnTypeOpcodes | 'STOP'
}

export interface ICallTypeStructLogs extends IFilteredStructLog {
    op: TCallTypeOpcodes
}
export interface ICreateTypeStructLogs extends IFilteredStructLog {
    op: TCreateTypeOpcodes
}
export interface IReturnTypeStructLogs extends IFilteredStructLog {
    op: TReturnTypeOpcodes
}

export interface IStorageTypeStructLogs extends IStructLog {
    index: number
    op: TStorageOpCodes
}
