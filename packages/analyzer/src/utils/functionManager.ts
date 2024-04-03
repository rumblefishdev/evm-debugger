/* eslint-disable sonarjs/cognitive-complexity */
import { BaseOpcodesHex, SourceFileType } from '@evm-debuger/types'
import type {
  TContractFunction,
  TContractFunctionInputParameter,
  TContractFunctionOutputParameter,
  TDisassembledBytecodeStructlog,
  TFunctionDebugData,
  TIndexedStructLog,
  TTraceLog,
} from '@evm-debuger/types'
import { v4 as uuid } from 'uuid'

import { selectFunctionBlockContextForLog } from '../helpers/helpers'
import { InputSourceManager } from '../strategies/inputSourceManager/inputSource.manager'

import type { DataLoader } from './dataLoader'

// [_]?[A-Za-z0-9_]+ -> function name
// (\s+([A-Za-z_]+\s?){0,7}?) -> modifiers ["view, pure, public, private, internal returns ..."]
// set only to 7 because of regex optimalization (max 7 modifiers) its good enough to cover preety much all cases

const regexForAllNewLineTypes = /\r\n|\n|\r/g
const regexpForFunctionWithoutParametersAndReturns = /function [_]?[A-Za-z0-9_]+\(\)(\s+([A-Za-z_]+\s?){0,7}?)\{/gim
const regexpForFunctionWithoutParametersAndWithReturns = /function [_]?[A-Za-z0-9_]+\(\)(\s+([A-Za-z_]+\s?)*?)\([^)]*\) \{/gim
const regexpForFunctionWithParametersAndWithoutReturns = /function [_]?[A-Za-z0-9_]+\([^)]+\)(\s+([A-Za-z_]+\s?){0,7}?)\{/gim
const regexpForFunctionWithParametersAndReturns = /function [_]?[A-Za-z0-9_]+\([^)]+\)(\s+([A-Za-z_]+\s?){0,7}?)\([^)]*?\)+ \{/gim

const regexpForYULFunction = /function ([a-zA-Z0-9_@_$]+)\([^)]+\)\s->\s(([a-zA-Z0-9_@,]+)(\s?))+/gim

const regexForOwnContractFunctionCalls = /[a-zA-Z0-9_@_$]+\([^;]*;/gim
const regexForExternalContractFunctionCalls = /([a-zA-Z0-9_@_$]+)\.[a-zA-Z0-9_@_$]+\([^;]*;/gim

export class FunctionManager {
  private dataLoader: DataLoader

  constructor(dataLoader: DataLoader) {
    this.dataLoader = dataLoader
  }

  private sanitizeFunctionExtraTabs(functionName: string) {
    return functionName.replace(/\s+/g, ' ')
  }

  private extractDataFromFunctiomLine(text: string, isYul?: boolean) {
    const sanitizedText = this.sanitizeFunctionExtraTabs(text)
    const parametersParenthesesStart = sanitizedText.indexOf('(')
    const parametersParenthesesEnd = sanitizedText.indexOf(')')

    const outputsParenthesesStart = isYul
      ? sanitizedText.indexOf('>', parametersParenthesesEnd + 1)
      : sanitizedText.indexOf(' (', parametersParenthesesEnd + 1)
    const outputsParenthesesEnd = isYul ? sanitizedText.length : sanitizedText.indexOf(')', parametersParenthesesEnd + 1)

    const functionNamePart = sanitizedText.slice(0, parametersParenthesesStart)
    const functionName = functionNamePart.split(' ').pop()

    const inputParameters: TContractFunctionInputParameter[] = []
    const inputParametersPart = sanitizedText.slice(parametersParenthesesStart + 1, parametersParenthesesEnd)
    if (inputParametersPart !== '') {
      if (inputParametersPart.includes(',')) {
        inputParameters.push(
          ...inputParametersPart.split(',').map((parameter, index) => {
            const elements = parameter.trim().split(' ')
            return {
              type: isYul ? 'string' : elements[0],
              stackInitialIndex: index,
              name: elements.at(-1),
              modifiers: elements.slice(1, -1),
              isArray: elements[0].includes('[]'),
              id: uuid(),
            }
          }),
        )
      } else {
        const elements = inputParametersPart.trim().split(' ')
        inputParameters.push({
          type: isYul ? 'string' : elements[0],
          stackInitialIndex: 0,
          name: elements.at(-1),
          modifiers: elements.slice(1, -1),
          isArray: elements[0].includes('[]'),
          id: uuid(),
        })
      }
    }

    inputParameters.forEach((inputParameter, index) => {
      const initialParameterIndex = inputParameters.length - 1 - inputParameter.stackInitialIndex
      const increaseByModifiers = inputParameters
        .slice(index)
        .reduce((accumulator, parameter) => accumulator + (parameter.isArray ? 1 : 0), 0)
      inputParameters[index].stackInitialIndex = initialParameterIndex + increaseByModifiers
    })

    const outputsParameters: TContractFunctionOutputParameter[] = []
    if (outputsParenthesesStart !== -1) {
      const outputsPart = sanitizedText.slice(outputsParenthesesStart + 1, outputsParenthesesEnd)
      if (outputsPart.includes(',')) {
        outputsParameters.push(
          ...outputsPart.split(',').map((parameter) => {
            const elements = parameter.trim().split(' ')
            return { type: isYul ? 'string' : elements[0], name: elements.at(-1), modifiers: elements.slice(1, -1) }
          }),
        )
      } else {
        outputsParameters.push({ type: outputsPart })
      }
    }

    const functionModifiers = isYul
      ? []
      : sanitizedText
          .slice(parametersParenthesesEnd + 1, outputsParenthesesStart)
          .trim()
          .split(' ')

    const functionSelector = `${functionName}(${inputParameters.map((parameter) => parameter.type).join(',')})`

    return { outputsParameters, inputParameters, functionSelector, functionName, functionModifiers }
  }

  public createFunctionsDictionary() {
    const contractAddreeses = this.dataLoader.getAddressesList()

    for (const contractAddress of contractAddreeses) {
      const isVerified = this.dataLoader.isContractVerified(contractAddress)
      if (!isVerified) continue

      const initialContractFunctions = this.dataLoader.analyzerContractData.get(contractAddress, 'functions')
      const contractFunctions: Record<number, TContractFunction> = { ...initialContractFunctions }

      const dissasembledBytecode = this.dataLoader.analyzerContractData.get(contractAddress, 'disassembledBytecode')

      const contractSourceFiles = this.dataLoader.analyzerContractData.get(contractAddress, 'sourceFiles')
      const contractInstructions = this.dataLoader.analyzerContractData.get(contractAddress, 'instructions')

      const functionsDebugData = this.dataLoader.inputContractData.get(contractAddress, 'functionDebugData')
      const functionDebugDataMappedToPc = Object.values(functionsDebugData || {}).reduce<Record<number, TFunctionDebugData>>(
        (accumulator, entry) => {
          if (entry.entryPoint) accumulator[entry.entryPoint] = entry
          return accumulator
        },
        {},
      )

      const jumpDestStructLogs = Object.values(dissasembledBytecode)
        .filter((structLog: TDisassembledBytecodeStructlog) => BaseOpcodesHex[structLog.opcode] === BaseOpcodesHex.JUMPDEST)
        .filter((structLog: TDisassembledBytecodeStructlog) => contractInstructions[structLog.pc]?.jumpType !== 'o')

      const fileIdsPresentInInstructrions = new Set(Object.values(contractInstructions).map((instruction) => instruction.fileId))
      const filteredSourceFiles = contractSourceFiles.filter((sourceFile) =>
        fileIdsPresentInInstructrions.has(contractSourceFiles.indexOf(sourceFile)),
      )

      for (const sourceFile of filteredSourceFiles) {
        const structLogsForSourceFile = jumpDestStructLogs.filter(
          (structLog) => contractInstructions[structLog.pc]?.fileId === contractSourceFiles.indexOf(sourceFile),
        )

        const sourceFileContent = sourceFile.content
        const sourceFileContentSplitted = sourceFileContent.split(regexForAllNewLineTypes)
        const sourceFileContentLines = this.sanitizeFunctionExtraTabs(sourceFileContentSplitted.join(' '))

        const functionsWithParametersAndReturns = sourceFileContentLines.match(regexpForFunctionWithParametersAndReturns)
        const functionsWithoutParametersAndReturns = sourceFileContentLines.match(regexpForFunctionWithoutParametersAndReturns)
        const functionsWithParametersAndWithoutReturns = sourceFileContentLines.match(regexpForFunctionWithParametersAndWithoutReturns)
        const functionsWithoutParametersAndWithReturns = sourceFileContentLines.match(regexpForFunctionWithoutParametersAndWithReturns)
        const yulFunctions = sourceFile.name === 'utility' && sourceFileContentLines.match(regexpForYULFunction)

        const functions = [
          ...(functionsWithParametersAndReturns || []),
          ...(functionsWithParametersAndWithoutReturns || []),
          ...(functionsWithoutParametersAndReturns || []),
          ...(functionsWithoutParametersAndWithReturns || []),
          ...(yulFunctions || []),
        ]

        const functionsWithParametersAndReturnsData = functions?.map((text) =>
          this.extractDataFromFunctiomLine(text, sourceFile.name === 'utility'),
        )

        functionsWithParametersAndReturnsData.forEach((functionData) => {
          const functionLineIndex = sourceFileContentSplitted.findIndex((line) => line.includes(`function ${functionData.functionName}(`))

          const structLogsForFunction = structLogsForSourceFile.filter((structLog) => {
            const instruction = contractInstructions[structLog.pc]
            return instruction?.startCodeLine === functionLineIndex
          })

          for (const structLog of structLogsForFunction) {
            contractFunctions[structLog.pc] = {
              traceLogIndex: -1,
              selector: functionData.functionSelector,
              pc: structLog.pc,
              outputs: functionData.outputsParameters,
              op: structLog.opcode,
              name: functionData.functionName,
              isYul: sourceFile.name === 'utility',
              isReverted: false,
              isMain: Boolean(functionDebugDataMappedToPc[structLog.pc]),
              isCallType: false,
              inputs: functionData.inputParameters,
              index: structLog.index,
              hasAbi: false,
              functionModifiers: functionData.functionModifiers,
              depth: 0,
              contraceName: sourceFile.name,
            }
          }
        })
      }

      for (const [pc, functionData] of Object.entries(contractFunctions)) {
        if (!functionData.isMain) continue
        const instruction = contractInstructions[Number(pc)]

        if (instruction) {
          const sourceFile = contractSourceFiles[instruction.fileId]
          const splittedSourceFileContent = sourceFile.content.split(regexForAllNewLineTypes)
          const functionBlock = splittedSourceFileContent.slice(instruction.startCodeLine + 1, instruction.endCodeLine + 1)

          const ownFunctions = functionBlock.join(' ').match(regexForOwnContractFunctionCalls)
          const externalFunctions = functionBlock.join(' ').match(regexForExternalContractFunctionCalls)

          const nestedFunctions: string[] = []

          if (ownFunctions) {
            nestedFunctions.push(...ownFunctions)
          }

          if (externalFunctions) {
            nestedFunctions.push(...externalFunctions)
          }

          contractFunctions[Number(pc)].nestedFunctions = nestedFunctions
        }
      }

      this.dataLoader.analyzerContractData.set(contractAddress, 'functions', contractFunctions)
    }
  }

  public createFunctonsList() {
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()
    const structLogs = this.dataLoader.analyzerStructLogs.get()
    const contractsFunctions = this.dataLoader.analyzerContractData.getAll('functions')
    const traceLogFunctionsList: Record<number, TContractFunction[]> = {}
    for (const traceLog of traceLogs) {
      const isVerified = this.dataLoader.isContractVerified(traceLog.address)
      if (!isVerified) continue

      const structLogsWithFunction: TIndexedStructLog[] = []
      const traceLogFunctions = contractsFunctions[traceLog.address]
      const traceLogInstructions = this.dataLoader.analyzerContractData.get(traceLog.address, 'instructions')
      const traceLogSourceFiles = this.dataLoader.analyzerContractData.get(traceLog.address, 'sourceFiles')
      const traceLogStructLogs = selectFunctionBlockContextForLog(structLogs, traceLog).filter(
        (structLog) => structLog.depth === traceLog.depth + 1,
      )

      const jumpDestStructLogs = traceLogStructLogs
        .filter((structLog) => BaseOpcodesHex[structLog.op] === BaseOpcodesHex.JUMPDEST)
        .filter((structLog) => traceLogInstructions[structLog.pc]?.jumpType !== 'o')

      const slicedTraceLogSourceFiles = traceLogSourceFiles.map((sourceFile) => {
        return sourceFile.content.split(regexForAllNewLineTypes)
      })
      for (const jumpDestStructLog of jumpDestStructLogs) {
        const jumpDestInstruction = traceLogInstructions[jumpDestStructLog.pc]
        // TODO: handle this case
        if (jumpDestInstruction.fileType === SourceFileType.UNKNOWN) continue

        const jumpDestSourceFile = slicedTraceLogSourceFiles[jumpDestInstruction.fileId]
        const jumpDestSourceLine = jumpDestSourceFile[jumpDestInstruction.startCodeLine]

        if (jumpDestSourceLine.includes('function')) {
          structLogsWithFunction.push(jumpDestStructLog)
        }
      }

      const result = structLogsWithFunction
        .sort((a, b) => a.index - b.index)
        .map((structLog) => {
          return {
            ...traceLogFunctions[structLog.pc],
            traceLogIndex: traceLog.index,
            isReverted: traceLog.isReverted,
            index: structLog.index,
          }
        })

      traceLogFunctionsList[traceLog.index] = result
    }

    return traceLogFunctionsList
  }

  private findPreviousFunction(traceLogFunctions: TContractFunction[], index: number) {
    let functionIndex = index
    while (functionIndex >= 0) {
      if (traceLogFunctions[functionIndex]) return traceLogFunctions[functionIndex]
      functionIndex--
    }
  }

  private findPreviousMainFunction(traceLogFunctions: TContractFunction[], index: number) {
    let functionIndex = index
    while (functionIndex >= 0) {
      if (traceLogFunctions[functionIndex]?.isMain && !traceLogFunctions[functionIndex]?.isYul) return traceLogFunctions[functionIndex]
      functionIndex--
    }
  }

  private convertTraceLogToFunction(traceLog: TTraceLog): TContractFunction {
    const baseContractInfo = this.dataLoader.analyzerContractData.get(traceLog.address, 'contractBaseData')

    const inputs: TContractFunctionInputParameter[] =
      traceLog.callTypeData?.functionFragment?.inputs?.map((input, index) => {
        return {
          value: traceLog.callTypeData.decodedInput.getValue(input.name),
          type: input.type,
          stackInitialIndex: index,
          name: input.name,
          modifiers: [],
          isArray: input.isArray(),
          id: uuid(),
        }
      }) || []

    const outputs: TContractFunctionOutputParameter[] =
      traceLog.callTypeData?.functionFragment?.outputs?.map((output, index) => {
        return {
          value: traceLog.callTypeData?.decodedOutput?.getValue(output.name),
          type: output.type,
        }
      }) || []

    return {
      traceLogIndex: traceLog.index,
      selector: traceLog.callTypeData?.functionFragment?.format('minimal').split(' ')[1] || 'placeholder',
      pc: traceLog.pc,
      outputs,
      op: traceLog.op,
      name: traceLog.callTypeData?.functionFragment?.name || traceLog.address,
      isYul: false,
      isReverted: traceLog.isReverted,
      isMain: true,
      isCallType: true,
      inputs,
      index: traceLog.index,
      hasAbi: true,
      functionModifiers: [],
      depth: traceLog.depth,
      contraceName: baseContractInfo.name,
    }
  }

  public createFunctionsStackTrace() {
    const traceLogsFunctionsList = this.createFunctonsList()

    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const runtimeFunctionsList: Record<string, Record<number, TContractFunction[]>> = {}

    for (const traceLog of traceLogs) {
      const isVerified = this.dataLoader.isContractVerified(traceLog.address)
      if (!isVerified) continue

      const traceLogFunctions = traceLogsFunctionsList[traceLog.index]
      const traceLogFunctionsCopy = [...traceLogFunctions]

      traceLogFunctionsCopy.forEach((traceLogFunction, index) => {
        if (!traceLogFunction) return
        if (index === 0) {
          traceLogFunctionsCopy[index].depth = traceLog.depth + 1
          return
        }

        const previousFunction = this.findPreviousFunction(traceLogFunctionsCopy, index - 1)
        const previousMainFunction = this.findPreviousMainFunction(traceLogFunctionsCopy, index - 1)

        if (!traceLogFunction.isMain || traceLogFunction.isYul) {
          traceLogFunctionsCopy[index].depth =
            previousFunction.isMain && !previousFunction.isYul ? previousFunction.depth + 1 : previousFunction.depth
          return
        }

        if (!previousMainFunction) {
          traceLogFunctionsCopy[index].depth = traceLog.depth + 1
          return
        }

        if (previousMainFunction?.nestedFunctions?.some((nestedFunction) => nestedFunction.includes(traceLogFunction.name))) {
          traceLogFunctionsCopy[index].depth = previousMainFunction.depth + 1
          return
        }
        traceLogFunctionsCopy[index].depth = previousMainFunction.depth
      })

      if (!runtimeFunctionsList[traceLog.address]) {
        runtimeFunctionsList[traceLog.address] = {}
      }
      runtimeFunctionsList[traceLog.address][traceLog.index] = traceLogFunctionsCopy
    }

    const traceLogList = [...traceLogs.map((traceLog) => this.convertTraceLogToFunction(traceLog))]

    const runTimeFunctionsList: TContractFunction[] = Object.values(runtimeFunctionsList).flatMap((functions) =>
      Object.values(functions).flatMap((functionList) => functionList),
    )

    const list = [...traceLogList, ...runTimeFunctionsList]

    const sortedList = list.sort((a, b) => a.index - b.index)

    this.dataLoader.analyzerRuntimeFunctionsList.set(sortedList)
  }

  public decodeFunctionsParameters() {
    const runtimeFunctionsList = this.dataLoader.analyzerRuntimeFunctionsList.get()
    const runtimeFunctionsWithDecodedParameters: Record<number, TContractFunction> = {}
    const structLogs = this.dataLoader.analyzerStructLogs.get()
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const indexIndexedStructLogs = structLogs.reduce<Record<number, TIndexedStructLog>>((accumulator, log) => {
      accumulator[log.index] = log
      return accumulator
    }, {})

    for (const functionIndex in runtimeFunctionsList) {
      const functionData = runtimeFunctionsList[functionIndex]

      if (!functionData || !functionData.isMain || functionData.isCallType) {
        runtimeFunctionsWithDecodedParameters[functionIndex] = functionData
        continue
      }

      const functionStructlog = indexIndexedStructLogs[functionData.index]
      const functionTraceLog = traceLogs.find((log) => log.index === functionData.traceLogIndex)

      const inputsWithDecodedParameters = functionData.inputs.map((input) => {
        const inputSource = new InputSourceManager(
          [...functionStructlog.stack].reverse(),
          functionStructlog.memory,
          functionTraceLog.input,
          input,
        )
        const inputSourceValue = inputSource.readValue()

        return { ...input, value: inputSourceValue, id: uuid() }
      })

      runtimeFunctionsWithDecodedParameters[functionIndex] = { ...functionData, inputs: inputsWithDecodedParameters }
    }

    this.dataLoader.analyzerRuntimeFunctionsList.set(runtimeFunctionsWithDecodedParameters)
  }
}
