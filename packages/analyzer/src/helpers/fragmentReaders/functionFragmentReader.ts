import { ethers } from 'ethers'
import { hexlify } from 'ethers/lib/utils'

import { BUILTIN_ERRORS, cachedAbis } from '../../resources/predefinedAbis'

export class FragmentReader {
  public storedFragments: Record<string, ethers.utils.Fragment> = {}

  constructor() {
    this.loadFragmentsFromCachedAbis()
  }

  private storeFragment(sighash: string, fragment: ethers.utils.Fragment) {
    this.storedFragments[sighash] = ethers.utils.Fragment.from(fragment)
  }

  private getFragment(sighash: string): ethers.utils.Fragment | null {
    return this.storedFragments[sighash] || null
  }

  public loadFunctionFragmentsFromAbi(abi: ethers.utils.Interface): void {
    const functionFragmentKeys = Object.keys(abi.functions)
    functionFragmentKeys.forEach((key) => {
      const fragment = abi.functions[key]
      this.storeFragment(abi.getSighash(fragment), fragment)
    })
  }

  private loadFragmentsFromCachedAbis(): void {
    Object.keys(cachedAbis).forEach((key) => {
      this.loadFunctionFragmentsFromAbi(cachedAbis[key])
    })
  }

  public decodeFragment(inputData: string, outputData: string) {
    const sighash = inputData.slice(0, 10)

    const fragment = this.getFragment(sighash)

    if (!fragment) return { functionDescription: null, decodedOutput: null, decodedInput: null }

    const abiInterface = new ethers.utils.Interface([fragment])

    const decodedInput = abiInterface.decodeFunctionData(fragment.name, inputData)
    const decodedOutput = abiInterface.decodeFunctionResult(fragment.name, outputData)
    const functionDescription: ethers.utils.TransactionDescription = abiInterface.parseTransaction({ data: inputData })

    return { functionDescription, decodedOutput, decodedInput }
  }

  private decodeErrorResult = (data: ethers.utils.BytesLike) => {
    const bytes = ethers.utils.arrayify(data)

    const selectorSignature = hexlify(bytes.slice(0, 4))

    const builtin = BUILTIN_ERRORS[selectorSignature]

    if (builtin) return new ethers.utils.AbiCoder().decode(builtin.inputs, bytes.slice(4))
  }

  public decodeFragmentWithError(inputData: string, output: string) {
    const inputSighash = inputData.slice(0, 10)
    const errorSighash = output.slice(0, 10)

    const inputFragment = this.getFragment(inputSighash)
    const errorFragment = BUILTIN_ERRORS[errorSighash]

    if (!inputFragment && !errorFragment)
      return { functionDescription: null, errorDescription: null, decodedOutput: null, decodedInput: null }

    if (!inputFragment) {
      const decodedOutput = this.decodeErrorResult(output)

      return { functionDescription: null, decodedOutput, decodedInput: null }
    }

    if (!errorFragment) {
      const abiInterface = new ethers.utils.Interface([inputFragment])

      const decodedInput = abiInterface.decodeFunctionData(inputFragment.name, inputData)
      const functionDescription = abiInterface.parseTransaction({ data: inputData })

      return { functionDescription, errorDescription: null, decodedOutput: null, decodedInput }
    }

    const abiInterface = new ethers.utils.Interface([inputFragment])

    const decodedInput = abiInterface.decodeFunctionData(inputFragment.name, inputData)
    const decodedOutput = this.decodeErrorResult(output)

    const functionDescription = abiInterface.parseTransaction({ data: inputData })
    const errorDescription = abiInterface.parseError(output as ethers.utils.BytesLike) as IErrorDescription

    return { functionDescription, errorDescription, decodedOutput, decodedInput }
  }
}
