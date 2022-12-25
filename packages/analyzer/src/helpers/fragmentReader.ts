import type {
  IErrorDescription,
  IFragmentDecodeResult,
  TAbi,
  TFragmentStore,
} from '@evm-debuger/types'
import { ethers } from 'ethers'

import { BUILTIN_ERRORS } from '../resources/builtinErrors'
import { cachedAbis } from '../resources/predefinedAbis'

export class FragmentReader {
  private fragmentStore = {
    function: {},
    event: {},
    error: {},
  } as TFragmentStore

  constructor() {
    this.loadFragmentsFromCachedAbis()
  }

  public storeFragment(
    sighash: string,
    fragment: ethers.utils.Fragment,
    type: 'function' | 'event' | 'error',
  ) {
    this.fragmentStore[type][sighash] = ethers.utils.Fragment.from(fragment)
  }

  public getFragment(
    sighash: string,
    type: 'function' | 'event' | 'error',
  ): ethers.utils.Fragment | null {
    return this.fragmentStore[type][sighash] || null
  }
  public loadFragmentsFromAbi(abiDefinition: TAbi): void {
    const abiInterface = new ethers.utils.Interface(abiDefinition)

    const functionFragmentKeys = Object.keys(abiInterface.functions)
    const errorFragmentKeys = Object.keys(abiInterface.errors)
    const eventFragmentKeys = Object.keys(abiInterface.events)

    errorFragmentKeys.forEach((key) => {
      const fragment = abiInterface.errors[key]
      this.storeFragment(abiInterface.getSighash(fragment), fragment, 'error')
    })

    eventFragmentKeys.forEach((key) => {
      const fragment = abiInterface.events[key]
      this.storeFragment(abiInterface.getSighash(fragment), fragment, 'event')
    })

    functionFragmentKeys.forEach((key) => {
      const fragment = abiInterface.functions[key]
      this.storeFragment(
        abiInterface.getSighash(fragment),
        fragment,
        'function',
      )
    })
  }

  private loadFragmentsFromCachedAbis(): void {
    Object.keys(cachedAbis).forEach((key) => {
      this.loadFragmentsFromAbi(cachedAbis[key])
    })
  }

  private decodeBuiltinErrorResult = (
    sighash: string,
    data: ethers.utils.BytesLike,
  ) => {
    const builtin = BUILTIN_ERRORS[sighash]

    const arrayify = ethers.utils.arrayify(data)

    return new ethers.utils.AbiCoder().decode(builtin.inputs, arrayify.slice(4))
  }

  public decodeFragment(
    isReverted: boolean,
    inputData: string,
    outputData: string,
  ): IFragmentDecodeResult {
    return isReverted
      ? this.decodeFragmentWithError(inputData, outputData)
      : this.decodeFragmentWithSuccess(inputData, outputData)
  }

  private decodeFragmentWithSuccess(
    inputData: string,
    outputData: string,
  ): IFragmentDecodeResult {
    const sighash = inputData.slice(0, 10)

    const functionFragment = this.getFragment(sighash, 'function')

    if (!functionFragment)
      return {
        functionDescription: null,
        errorDescription: null,
        decodedOutput: null,
        decodedInput: null,
      }

    const abiInterface = new ethers.utils.Interface([functionFragment])

    const decodedInput = abiInterface.decodeFunctionData(
      functionFragment.name,
      inputData,
    )
    const decodedOutput = abiInterface.decodeFunctionResult(
      functionFragment.name,
      outputData,
    )
    const functionDescription: ethers.utils.TransactionDescription =
      abiInterface.parseTransaction({ data: inputData })

    return {
      functionDescription,
      errorDescription: null,
      decodedOutput,
      decodedInput,
    }
  }

  private decodeFragmentWithError(
    inputData: string,
    output: string,
  ): IFragmentDecodeResult {
    let decodedInput: ethers.utils.Result | null = null
    let decodedOutput: ethers.utils.Result | null = null
    let functionDescription: ethers.utils.TransactionDescription | null = null
    let errorDescription: IErrorDescription | null = null

    const inputSighash = inputData.slice(0, 10)
    const errorSighash = output.slice(0, 10)

    const functionFragment = this.getFragment(inputSighash, 'function')
    const errorFragment = this.getFragment(errorSighash, 'error')

    if (functionFragment) {
      const abiInterface = new ethers.utils.Interface([functionFragment])

      decodedInput = abiInterface.decodeFunctionData(
        functionFragment.name,
        inputData,
      )
      functionDescription = abiInterface.parseTransaction({ data: inputData })
    }

    if (BUILTIN_ERRORS[errorSighash])
      decodedOutput = this.decodeBuiltinErrorResult(errorSighash, output)

    if (errorFragment) {
      const abiInterface = new ethers.utils.Interface([errorFragment])

      decodedOutput = new ethers.utils.AbiCoder().decode(
        errorFragment.inputs,
        output,
      )
      errorDescription = abiInterface.parseError(output) as IErrorDescription
    }

    return {
      functionDescription,
      errorDescription,
      decodedOutput,
      decodedInput,
    }
  }

  public decodeEvent(eventData: string, topics: string[]) {
    const sighash = topics[0].slice(0, 10)

    const eventFragment = this.getFragment(sighash, 'event')

    if (!eventFragment) return { eventDescription: null, decodedEvent: null }

    const abiInterface = new ethers.utils.Interface([eventFragment])

    const decodedEvent = abiInterface.decodeEventLog(
      eventFragment.name,
      eventData,
      topics,
    )
    const eventDescription: ethers.utils.LogDescription = abiInterface.parseLog(
      { topics, data: eventData },
    )

    return { eventDescription, decodedEvent }
  }
}
