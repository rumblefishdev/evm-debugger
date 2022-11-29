import type {
    ICallTypeTraceLog,
    ICreateTypeTraceLog,
    ITraceLog,
    IReturnTypeTraceLog,
    IStopTypeTraceLog,
    TCallTypeArgs,
    TCreateTypeArgs,
    TReturnTypeArgs,
    ICallTypeStructLogs,
    ICreateTypeStructLogs,
    IFilteredStructLog,
    IReturnTypeStructLogs,
    IStructLog,
} from '@evm-debuger/types'

import type { StackCounter } from '../helpers/stackCounter'

import { extractArgsFromStack, extractCallTypeArgsData, extractCreateTypeArgsData, extractReturnTypeArgsData } from './argsExtractors'

export class StructLogParser {
    constructor(
        private readonly filteredStructLog: IFilteredStructLog,
        private readonly structLogs: IStructLog[],
        private readonly stackCounter: StackCounter
    ) {}

    private extractDefaultData() {
        const { depth, gas, gasCost, op, pc, index } = this.filteredStructLog

        return { type: op, pc, passedGas: gas, index, gasCost, depth } as ITraceLog
    }

    private createStackTrace(depth: number): number[] {
        return this.stackCounter.visitDepth(depth)
    }

    public parseStopStructLog() {
        return { ...this.extractDefaultData() } as IStopTypeTraceLog
    }

    public parseCallStructLog() {
        const { depth, memory, index, op, stack } = this.filteredStructLog as ICallTypeStructLogs

        const opCodeArguments = extractArgsFromStack(stack, op) as TCallTypeArgs

        return {
            ...extractCallTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
            startIndex: index + 1,
            stackTrace: this.createStackTrace(depth),
            passedGas: this.structLogs[index + 1].gas,
        } as ICallTypeTraceLog
    }

    public parseCreateStructLog() {
        const { depth, memory, index, stack, op } = this.filteredStructLog as ICreateTypeStructLogs

        const opCodeArguments = extractArgsFromStack(stack, op) as TCreateTypeArgs

        return {
            ...extractCreateTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
            startIndex: index + 1,
            stackTrace: this.createStackTrace(depth),
            passedGas: this.structLogs[index + 1].gas,
        } as ICreateTypeTraceLog
    }

    public parseReturnStructLog() {
        const { memory, stack, op } = this.filteredStructLog as IReturnTypeStructLogs

        const opCodeArguments = extractArgsFromStack(stack, op) as TReturnTypeArgs

        return {
            ...extractReturnTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
        } as IReturnTypeTraceLog
    }
}
