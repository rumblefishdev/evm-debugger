import { StackCounter } from '../helpers/stackCounter'
import {
    OpCodesArgsArray,
    TCallArgs,
    TCallCodeArgs,
    TCreate2Args,
    TCreateArgs,
    TDelegateCallArgs,
    TOpCodes,
    TOpCodesArgs,
    TReturnArgs,
    TRevertArgs,
    TStaticCallArgs,
} from '../typings/opcodes'
import {
    ICallTypeTraceLogs,
    ICreateTypeTraceLogs,
    IParsedTraceLogs,
    IReturnTypeTraceLogs,
    IStopTypeTraceLogs,
    IStructLog,
    IBaseStructLog,
} from '../typings/types'
import { extractCallTypeArgsData, extractCreateTypeArgsData, extractReturnTypeArgsData } from './argsExtractors'

export class StructLogParser {
    constructor(
        private readonly structLog: IBaseStructLog,
        private readonly traceLogs: IStructLog[],
        private readonly stackCounter: StackCounter
    ) {}

    private extractDefaultData() {
        const { depth, gas, gasCost, op, pc, index } = this.structLog

        return { type: op, depth, passedGas: gas, gasCost, pc, index } as IParsedTraceLogs
    }

    private createStackTrace(depth: number): number[] {
        return this.stackCounter.visitDepth(depth)
    }

    private extractArgsFromStack() {
        const stack = this.structLog.stack
        const op = this.structLog.op as Exclude<TOpCodes, 'STOP'>

        const opCodeArgumentsNames = OpCodesArgsArray[op]

        const opCodeArguments = {} as TOpCodesArgs[typeof op]

        opCodeArgumentsNames.forEach((arg: string, index: number) => {
            opCodeArguments[arg] = stack[stack.length - index - 1]
        })

        return opCodeArguments
    }

    public parseStopStructLog() {
        return { ...this.extractDefaultData() } as IStopTypeTraceLogs
    }

    public parseCallStructLog() {
        const { depth, memory, index } = this.structLog

        const opCodeArguments = this.extractArgsFromStack() as TCallArgs | TCallCodeArgs | TDelegateCallArgs | TStaticCallArgs

        return {
            ...extractCallTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
            startIndex: index + 1,
            passedGas: this.traceLogs[index + 1].gas,
            stackTrace: this.createStackTrace(depth),
        } as ICallTypeTraceLogs
    }

    public parseCreateStructLog() {
        const { depth, memory, index } = this.structLog

        const opCodeArguments = this.extractArgsFromStack() as TCreateArgs | TCreate2Args

        return {
            ...extractCreateTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
            startIndex: index + 1,
            passedGas: this.traceLogs[index + 1].gas,
            stackTrace: this.createStackTrace(depth),
        } as ICreateTypeTraceLogs
    }

    public parseReturnStructLog() {
        const { memory } = this.structLog

        const opCodeArguments = this.extractArgsFromStack() as TReturnArgs | TRevertArgs

        return {
            ...extractReturnTypeArgsData(opCodeArguments, memory),
            ...this.extractDefaultData(),
        } as IReturnTypeTraceLogs
    }
}
