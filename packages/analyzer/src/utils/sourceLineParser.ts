/* eslint-disable sonarjs/cognitive-complexity */

import { SourceFileType } from '@evm-debuger/types'
import type {
  TDisassembledBytecodeStructlog,
  TOpcodesNames,
  TPcIndexedStepInstructions,
  TSourceMapConverstionPayload,
  TStructlogsPerStartLine,
} from '@evm-debuger/types'

import { getPcIndexedStructlogsForContractAddress } from '../helpers/helpers'

import {
  createSourceMapIdentifier,
  createSourceMapToSourceCodeDictionary,
  getUniqueSourceMaps,
  sourceMapConverter,
} from './sourceMapConverter'
import type { DataLoader } from './dataLoader'

export class SourceLineParser {
  private dataLoader: DataLoader

  constructor(dataLoader: DataLoader) {
    this.dataLoader = dataLoader
  }

  public createContractsInstructions() {
    const traceLogs = this.dataLoader.analyzerTraceLogs.get()

    const dataToDecode: TSourceMapConverstionPayload[] = []
    const listOfContractsAddresses = this.dataLoader.getAddressesList()

    for (const contractAddress of listOfContractsAddresses) {
      const isVerified = this.dataLoader.isContractVerified(contractAddress)
      if (!isVerified) continue

      const contractSourceMap = this.dataLoader.inputContractData.get(contractAddress, 'sourceMap')
      const contractSourceFiles = this.dataLoader.analyzerContractData.get(contractAddress, 'sourceFiles')
      const contractName = this.dataLoader.analyzerContractData.get(contractAddress, 'contractBaseData')?.name

      if (!contractSourceMap || !contractSourceFiles || !contractName) continue

      dataToDecode.push({ contractSourceMap, contractSourceFiles, contractName, contractAddress })
    }

    const getPreivousValidInstruction = (
      instructions: TPcIndexedStepInstructions,
      currentPc: number,
      orignalPc: number,
      orignalOpcode: TOpcodesNames | string,
    ) => {
      if (
        !instructions[currentPc] ||
        instructions[currentPc]?.fileType === SourceFileType.UNKNOWN ||
        instructions[currentPc]?.fileId === -1
      ) {
        return getPreivousValidInstruction(instructions, currentPc - 1, orignalPc, orignalOpcode)
      }

      return { ...instructions[currentPc], pc: orignalPc, opcode: orignalOpcode }
    }

    return dataToDecode.forEach(({ contractAddress, contractSourceMap, contractSourceFiles }) => {
      const convertedSourceMap = sourceMapConverter(contractSourceMap)
      const uniqueSourceMaps = getUniqueSourceMaps(convertedSourceMap)

      const uniqueSoruceMapsCodeLinesDictionary = createSourceMapToSourceCodeDictionary(contractSourceFiles, uniqueSourceMaps)

      const disassembledBytecode = this.dataLoader.analyzerContractData.get(contractAddress, 'disassembledEtherscanBytecode')

      const mapDisasemlbedBytecodeToIndex = Object.values(disassembledBytecode).reduce<Record<number, TDisassembledBytecodeStructlog>>(
        (accumulator, disassembledBytecodeEntry, index) => {
          accumulator[index] = disassembledBytecodeEntry
          return accumulator
        },
        {},
      )

      const instructions: TPcIndexedStepInstructions = convertedSourceMap.reduce((accumulator, sourceMapEntry, index) => {
        const instructionId = createSourceMapIdentifier(sourceMapEntry)

        if (!uniqueSoruceMapsCodeLinesDictionary[instructionId]) return accumulator
        if (!mapDisasemlbedBytecodeToIndex[index]) return accumulator

        const { pc, opcode } = mapDisasemlbedBytecodeToIndex[index]

        accumulator[pc] = { ...uniqueSoruceMapsCodeLinesDictionary[instructionId], pc, opcode }
        return accumulator
      }, {} as TPcIndexedStepInstructions)

      const contractStructlogs = getPcIndexedStructlogsForContractAddress(
        traceLogs,
        this.dataLoader.analyzerStructLogs.get(),
        contractAddress,
      )

      const valdiatedInstructions = Object.values(instructions).reduce((accumulator, instruction) => {
        if (instruction.fileType === SourceFileType.UNKNOWN || instruction.fileId === -1) {
          const previousInstruction = getPreivousValidInstruction(instructions, instruction.pc - 1, instruction.pc, instruction.opcode)
          accumulator[instruction.pc] = previousInstruction
          return accumulator
        }

        accumulator[instruction.pc] = instruction
        return accumulator
      }, {} as TPcIndexedStepInstructions)

      const structlogsPerStartLine = Object.values(valdiatedInstructions).reduce((accumulator, instruction) => {
        if (!accumulator[instruction.fileId]) accumulator[instruction.fileId] = {}
        if (!accumulator[instruction.fileId][instruction.startCodeLine] && contractStructlogs[instruction.pc]?.length > 0)
          accumulator[instruction.fileId][instruction.startCodeLine] = []
        if (contractStructlogs[instruction.pc]?.length > 0) {
          accumulator[instruction.fileId][instruction.startCodeLine].push(...contractStructlogs[instruction.pc])
        }
        return accumulator
      }, {} as TStructlogsPerStartLine)

      this.dataLoader.analyzerContractData.set(contractAddress, 'instructions', valdiatedInstructions)
      this.dataLoader.analyzerContractData.set(contractAddress, 'structlogsPerStartLine', structlogsPerStartLine)
    })
  }
}
