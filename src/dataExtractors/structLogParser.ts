import { StackCounter } from '../helpers/stackCounter'
import { ICallTypeTraceLog, ICreateTypeTraceLog, ITraceLog, IReturnTypeTraceLog, IStopTypeTraceLog } from '../typings/parsedLogs'
import { TCallTypeArgs, TCreateTypeArgs, TReturnTypeArgs } from '../typings/stackArgs'
import { ICallTypeStructLogs, ICreateTypeStructLogs, IFilteredStructLog, IReturnTypeStructLogs, IStructLog } from '../typings/structLogs'
import { extractArgsFromStack, extractCallTypeArgsData, extractCreateTypeArgsData, extractReturnTypeArgsData } from './argsExtractors'

export class StructLogParser {
    constructor(
        private readonly filteredStructLog: IFilteredStructLog,
        private readonly structLogs: IStructLog[],
        private readonly stackCounter: StackCounter
    ) {}

    private extractDefaultData() {
        const { depth, gas, gasCost, op, pc, index } = this.filteredStructLog

        return { type: op, depth, passedGas: gas, gasCost, pc, index } as ITraceLog
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
            passedGas: this.structLogs[index + 1].gas,
            stackTrace: this.createStackTrace(depth),
        } as ICallTypeTraceLog
    }

    public parseCreateStructLog() {
        const { depth, memory, index, stack, op } = this.filteredStructLog as ICreateTypeStructLogs

        const opCodeArguments = extractArgsFromStack(stack, op) as TCreateTypeArgs

        return {
            ...extractCreateTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
            startIndex: index + 1,
            passedGas: this.structLogs[index + 1].gas,
            stackTrace: this.createStackTrace(depth),
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
