/* eslint-disable sonarjs/cognitive-complexity */
import type { IFragmentDecodeResult, TAbi, TFragmentStore } from '@evm-debuger/types'
import type { Fragment, Result, ErrorDescription, LogDescription, EventFragment, FunctionFragment, ErrorFragment } from 'ethers'
import { Interface, dataSlice, getBytesCopy } from 'ethers'

import { BUILTIN_ERRORS, createErrorDescription } from '../resources/builtinErrors'
import { cachedAbis } from '../resources/predefinedAbis'

export class FragmentReader {
  private fragmentStore: TFragmentStore = {
    function: {},
    event: {},
    error: { ...BUILTIN_ERRORS },
  }

  constructor() {
    this.loadFragmentsFromCachedAbis()
  }

  public storeFragment(sighash: string, fragment: Fragment, type: 'function' | 'event' | 'error') {
    console.log('DEBUG:', {
      type,
      sighash,
      fragment,
    })
    switch (type) {
      case 'function':
        this.fragmentStore['function'][sighash] = fragment as FunctionFragment
        break
      case 'event':
        this.fragmentStore['event'][sighash] = fragment as EventFragment
        break
      case 'error':
        this.fragmentStore['error'][sighash] = fragment as ErrorFragment
        break
      default:
        break
    }
  }

  public getFunctionFragment(sighash: string): FunctionFragment {
    return this.fragmentStore['function'][sighash] || null
  }

  public getEventFragment(sighash: string): EventFragment {
    return this.fragmentStore['event'][sighash] || null
  }

  public getErrorFragment(sighash: string): ErrorFragment {
    return this.fragmentStore['error'][sighash] || null
  }
  public loadFragmentsFromAbi(abiDefinition: TAbi): void {
    const abiInterface = new Interface(abiDefinition)

    abiInterface.forEachFunction((fragment) => {
      const functionFragment = abiInterface.getFunction(fragment.selector, [...fragment.inputs])
      this.storeFragment(functionFragment.selector, functionFragment, 'function')
    })

    abiInterface.forEachEvent((fragment) => {
      const eventFragment = abiInterface.getEvent(fragment.name, [...fragment.inputs])
      this.storeFragment(eventFragment.topicHash.slice(0, 10), eventFragment, 'event')
    })

    abiInterface.forEachError((fragment) => {
      const errorFragment = abiInterface.getError(fragment.selector, [...fragment.inputs])
      this.storeFragment(errorFragment.selector, errorFragment, 'error')
    })
  }

  private loadFragmentsFromCachedAbis(): void {
    Object.keys(cachedAbis).forEach((key) => {
      this.loadFragmentsFromAbi(cachedAbis[key])
    })
  }

  public decodeFragment(isReverted: boolean, inputData: string, outputData: string): IFragmentDecodeResult {
    return isReverted ? this.decodeFragmentWithError(inputData, outputData) : this.decodeFragmentWithSuccess(inputData, outputData)
  }

  private decodeFragmentWithSuccess(inputData: string, outputData: string): IFragmentDecodeResult {
    const sighash = inputData.slice(0, 10)

    const functionFragment = this.getFunctionFragment(sighash)

    if (!functionFragment)
      return {
        functionFragment: null,
        errorDescription: null,
        decodedOutput: null,
        decodedInput: null,
      }

    const abiInterface = new Interface([functionFragment])

    let decodedInput: Result | null
    let decodedOutput: Result | null
    let errorDescription: ErrorDescription | null = null

    try {
      decodedInput = abiInterface.decodeFunctionData(functionFragment, inputData)
    } catch {
      try {
        decodedInput = abiInterface.getAbiCoder().decode(functionFragment.inputs, dataSlice(inputData, 4), true)
      } catch (error) {
        if (error instanceof Error && error.message) {
          errorDescription = createErrorDescription(error.message)
        }
        decodedInput = null
      }
    }

    try {
      decodedOutput = abiInterface.decodeFunctionResult(functionFragment.name, outputData)
    } catch {
      try {
        decodedOutput = abiInterface.getAbiCoder().decode(functionFragment.outputs, getBytesCopy(outputData), true)
      } catch (error) {
        if (error instanceof Error && error.message) {
          errorDescription = createErrorDescription(error.message)
        }
        decodedOutput = null
      }
    }
    return {
      functionFragment,
      errorDescription,
      decodedOutput,
      decodedInput,
    }
  }

  private decodeFragmentWithError(inputData: string, output: string): IFragmentDecodeResult {
    let decodedInput: Result | null = null
    let decodedOutput: Result | null = null
    let errorDescription: ErrorDescription | null = null

    const inputSighash = inputData.slice(0, 10)
    const errorSighash = output.slice(0, 10)

    const functionFragment = this.getFunctionFragment(inputSighash)
    const errorFragment = this.getErrorFragment(errorSighash)

    if (functionFragment) {
      const abiInterface = new Interface([functionFragment])

      try {
        decodedInput = abiInterface.decodeFunctionData(functionFragment, inputData)
      } catch {
        try {
          decodedInput = abiInterface.getAbiCoder().decode(functionFragment.inputs, dataSlice(inputData, 4), true)
        } catch (error) {
          if (error instanceof Error && error.message) {
            errorDescription = createErrorDescription(error.message)
          }
          decodedInput = null
        }
      }
    }

    if (errorFragment) {
      const abiInterface = new Interface([errorFragment])

      try {
        decodedOutput = abiInterface.decodeErrorResult(errorFragment, output)
        errorDescription = abiInterface.parseError(output)
      } catch (error) {
        if (error instanceof Error && error.message) {
          errorDescription = createErrorDescription(error.message)
        }
      }
    } else {
      errorDescription = createErrorDescription(`Raw error data: ${output}`)
    }

    return {
      functionFragment,
      errorDescription,
      decodedOutput,
      decodedInput,
    }
  }

  public decodeEvent(eventData: string, topics: string[]) {
    const sighash = topics[0].slice(0, 10)

    const eventFragment = this.getEventFragment(sighash)

    if (!eventFragment) return { eventDescription: null, decodedEvent: null }

    const abiInterface = new Interface([eventFragment])

    let decodedEvent

    try {
      decodedEvent = abiInterface.decodeEventLog(eventFragment, eventData, topics)
    } catch {
      return { eventDescription: null, decodedEvent: null }
    }
    const eventDescription: LogDescription = abiInterface.parseLog({ topics, data: eventData })

    return { eventDescription, decodedEvent }
  }
}
