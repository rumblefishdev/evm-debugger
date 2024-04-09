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

const regexForAllNewLineTypes = /\r\n|\n|\r/g

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
    const functionDefinition = sanitizedText.slice(0, sanitizedText.indexOf('{'))
    const parametersParenthesesStart = functionDefinition.indexOf('(')
    const parametersParenthesesEnd = functionDefinition.indexOf(')')

    const outputsParenthesesStart = isYul
      ? functionDefinition.indexOf('>', parametersParenthesesEnd + 1)
      : functionDefinition.indexOf(' (', parametersParenthesesEnd + 1)
    const outputsParenthesesEnd = isYul ? functionDefinition.length : functionDefinition.indexOf(')', parametersParenthesesEnd + 1)

    const functionNamePart = functionDefinition.slice(0, parametersParenthesesStart)
    const functionName = functionNamePart.split(' ').pop()

    const inputParameters: TContractFunctionInputParameter[] = []
    const inputParametersPart = functionDefinition.slice(parametersParenthesesStart + 1, parametersParenthesesEnd)
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
      const outputsPart = functionDefinition.slice(outputsParenthesesStart + 2, outputsParenthesesEnd)
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
      : functionDefinition
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

        const newFunctions: string[] = this.sanitizeFunctionExtraTabs(sourceFileContent).match(/function ([a-zA-Z0-9_@_$]+)/gim)

        const nextFunctions: { functionRaw: string; lineIndex: number; sourceFileIndex: number }[] = []

        newFunctions?.forEach((text, index) => {
          if (index === 0) {
            const startIndex = sourceFile.content.indexOf(text)
            const lineIndex = sourceFile.content.slice(0, startIndex).split(regexForAllNewLineTypes).length - 1
            const nextFunction = sourceFile.content.slice(startIndex, sourceFile.content.indexOf('}', startIndex) + 1)
            nextFunctions.push({ sourceFileIndex: startIndex, lineIndex, functionRaw: nextFunction })
            return
          }

          const startIndex = sourceFile.content.indexOf(text, nextFunctions.at(-1).sourceFileIndex + 1)
          const lineIndex = sourceFile.content.slice(0, startIndex).split(regexForAllNewLineTypes).length - 1
          const nextFunction = sourceFile.content.slice(startIndex, sourceFile.content.indexOf('}', startIndex) + 1)
          nextFunctions.push({ sourceFileIndex: startIndex, lineIndex, functionRaw: nextFunction })
        })

        const functionsWithParametersAndReturnsData = nextFunctions.map((functionEntry) => ({
          ...this.extractDataFromFunctiomLine(functionEntry.functionRaw, sourceFile.name === 'utility'),
          lineIndex: functionEntry.lineIndex,
          functionRaw: functionEntry.functionRaw,
        }))

        functionsWithParametersAndReturnsData.forEach((functionData) => {
          const structLogsForFunction = structLogsForSourceFile.filter((structLog) => {
            const instruction = contractInstructions[structLog.pc]
            return instruction?.startCodeLine === functionData.lineIndex
          })

          if (functionData.functionName === 'pairForPreSorted') {
            console.log('functionData', functionData)
            console.log('structLogsForFunction', structLogsForFunction)
          }

          const nestedFunctions = []
          const functionBody = functionData.functionRaw.slice(
            functionData.functionRaw.indexOf('{') + 1,
            functionData.functionRaw.lastIndexOf('}'),
          )

          const ownFunctions = functionBody.match(regexForOwnContractFunctionCalls) || []
          const externalFunctions = functionBody.match(regexForExternalContractFunctionCalls) || []

          nestedFunctions.push(...ownFunctions)
          nestedFunctions.push(...externalFunctions)

          for (const structLog of structLogsForFunction) {
            contractFunctions[structLog.pc] = {
              traceLogIndex: -1,
              selector: functionData.functionSelector,
              pc: structLog.pc,
              outputs: functionData.outputsParameters,
              op: structLog.opcode,
              nestedFunctions,
              name: functionData.functionName,
              lineIndex: functionData.lineIndex,
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

      this.dataLoader.analyzerContractData.set(contractAddress, 'functions', contractFunctions)
    }
  }

  public createFunctonsList() {
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()
    const structLogs = this.dataLoader.analyzerStructLogs.get()
    const contractsFunctions = this.dataLoader.analyzerContractData.getAll('functions')

    console.log('contractsFunctions', contractsFunctions)

    const traceLogFunctionsList: Record<number, TContractFunction[]> = {}
    for (const traceLog of traceLogs) {
      const isVerified = this.dataLoader.isContractVerified(traceLog.address)
      if (!isVerified) continue

      const traceLogFunctions = contractsFunctions[traceLog.address]
      const traceLogInstructions = this.dataLoader.analyzerContractData.get(traceLog.address, 'instructions')
      const traceLogStructLogs = selectFunctionBlockContextForLog(structLogs, traceLog).filter(
        (structLog) => structLog.depth === traceLog.depth + 1,
      )

      const jumpdestStructlogs = traceLogStructLogs.filter((structLog) => BaseOpcodesHex[structLog.op] === BaseOpcodesHex.JUMPDEST)

      const outJumpStructlogs = jumpdestStructlogs.filter((structLog) => traceLogInstructions[structLog.pc]?.jumpType !== 'o')

      const removedUnnecessaryStructLogs = outJumpStructlogs.filter(
        (structLog) => traceLogInstructions[structLog.pc]?.fileType !== SourceFileType.UNKNOWN,
      )
      const functionStructlogs = removedUnnecessaryStructLogs.filter((structLog) => Boolean(traceLogFunctions[structLog.pc]))

      if (traceLog.address === '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad') {
        console.log('traceLogStructLogs', traceLogStructLogs)
        console.log('jumpdestStructlogs', jumpdestStructlogs)
        console.log('outJumpStructlogs', outJumpStructlogs)
        console.log('removedUnnecessaryStructLogs', removedUnnecessaryStructLogs)
        console.log('functionStructlogs', functionStructlogs)
      }

      const result = functionStructlogs
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

  private findPreviousFunction(traceLogFunctions: TContractFunction[], index: number, traceLogIndex: number) {
    let functionIndex = index
    while (functionIndex >= 0) {
      if (traceLogFunctions[functionIndex] && traceLogFunctions[functionIndex].traceLogIndex === traceLogIndex)
        return traceLogFunctions[functionIndex]
      functionIndex--
    }
  }

  private findPreviousMainFunction(traceLogFunctions: TContractFunction[], index: number, traceLogIndex: number) {
    let functionIndex = index
    while (functionIndex >= 0) {
      if (
        traceLogFunctions[functionIndex]?.isMain &&
        !traceLogFunctions[functionIndex]?.isYul &&
        traceLogFunctions[functionIndex].traceLogIndex === traceLogIndex
      )
        return traceLogFunctions[functionIndex]
      functionIndex--
    }

    functionIndex = index
    while (functionIndex >= 0) {
      if (traceLogFunctions[functionIndex]?.isMain && !traceLogFunctions[functionIndex]?.isYul) return traceLogFunctions[functionIndex]
      functionIndex--
    }
  }

  private convertTraceLogToFunction(traceLog: TTraceLog, contractFunctions: TContractFunction[]): TContractFunction {
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

    const selector = traceLog.callTypeData?.functionFragment?.format('minimal').split(' ')[1] || 'placeholder'

    return {
      traceLogIndex: traceLog.index,
      selector,
      pc: traceLog.pc,
      outputs,
      op: traceLog.op,
      nestedFunctions: contractFunctions.find((func) => func.selector === selector)?.nestedFunctions || [],
      name: traceLog.callTypeData?.functionFragment?.name || traceLog.address,
      lineIndex: contractFunctions.find((func) => func.selector === selector)?.lineIndex || 0,
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
    const flattedFunctions = Object.values(traceLogsFunctionsList).flatMap((functions) => functions)

    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const newRuntimeFunctionsList: Record<number, TContractFunction> = {}

    const joinedList = [
      ...flattedFunctions,
      ...traceLogs.map((traceLog) => this.convertTraceLogToFunction(traceLog, flattedFunctions)),
    ].sort((a, b) => a.index - b.index)

    for (const functionEntry of joinedList) {
      const previousFunction = this.findPreviousFunction(
        Object.values(newRuntimeFunctionsList),
        functionEntry.index - 1,
        functionEntry.traceLogIndex,
      )
      const previousMainFunction = this.findPreviousMainFunction(
        Object.values(newRuntimeFunctionsList),
        functionEntry.index - 1,
        functionEntry.traceLogIndex,
      )

      if (functionEntry.isYul && !previousFunction.isYul) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: previousFunction.depth + 1 }
        continue
      }

      if (functionEntry.isYul && previousFunction.isYul) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: previousFunction.depth }
        continue
      }

      if (!functionEntry.isMain) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: (previousMainFunction?.depth || 0) + 1 }
        continue
      }

      const allPreviousMainFunctions = Object.values(newRuntimeFunctionsList)
        .filter((func) => func.isMain && !func.isYul)
        .reverse()

      if (allPreviousMainFunctions.length === 0) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: 0 }
        continue
      }

      if (allPreviousMainFunctions.length === 1) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: 1 }
        continue
      }

      const callTypeSameFunction = allPreviousMainFunctions.find(
        (mainFunction) => mainFunction.name === functionEntry.name && mainFunction.isCallType,
      )

      if (callTypeSameFunction) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: callTypeSameFunction.depth + 1 }
        continue
      }

      const parentFunction = allPreviousMainFunctions.find((mainFunction) =>
        mainFunction.nestedFunctions?.some((nestedFunction) => nestedFunction.includes(functionEntry.name)),
      )

      if (parentFunction) {
        newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: parentFunction.depth + 1 }
        continue
      }

      newRuntimeFunctionsList[functionEntry.index] = { ...functionEntry, depth: previousMainFunction.depth }
    }

    console.log('newRuntimeFunctionsList', newRuntimeFunctionsList)

    this.dataLoader.analyzerRuntimeFunctionsList.set(newRuntimeFunctionsList)
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
        const inputSource = new InputSourceManager(functionStructlog.stack, functionStructlog.memory, functionTraceLog.input, input)
        const inputSourceValue = inputSource.readValue()

        return { ...input, value: inputSourceValue, id: uuid() }
      })

      const hasInitialInvalidInputs = inputsWithDecodedParameters.some((input) => input.value === 'Invalid')

      const reversedInputsWithDecodedParameters = functionData.inputs.map((input) => {
        const inputSource = new InputSourceManager(
          [...functionStructlog.stack].reverse(),
          functionStructlog.memory,
          functionTraceLog.input,
          input,
        )
        const inputSourceValue = inputSource.readValue()

        return { ...input, value: inputSourceValue, id: uuid() }
      })

      const hasReversedInvalidInputs = reversedInputsWithDecodedParameters.some((input) => input.value === 'Invalid')

      if (hasInitialInvalidInputs && !hasReversedInvalidInputs) {
        runtimeFunctionsWithDecodedParameters[functionIndex] = { ...functionData, inputs: reversedInputsWithDecodedParameters }
        continue
      }

      runtimeFunctionsWithDecodedParameters[functionIndex] = { ...functionData, inputs: inputsWithDecodedParameters }
    }

    console.log(runtimeFunctionsWithDecodedParameters)

    this.dataLoader.analyzerRuntimeFunctionsList.set(runtimeFunctionsWithDecodedParameters)
  }
}
