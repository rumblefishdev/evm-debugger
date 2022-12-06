import type { IErrorDescription } from '@evm-debuger/types'
import { ethers } from 'ethers'

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

  private decodeErrorResult = (sighash: string, data: ethers.utils.BytesLike) => {
    const builtin = BUILTIN_ERRORS[sighash]

    const arrayify = ethers.utils.arrayify(data)

    return new ethers.utils.AbiCoder().decode(builtin.inputs, arrayify.slice(4))
  }

  public decodeFragmentWithError(inputData: string, output: string) {
    let decodedInput: ethers.utils.Result | null = null
    let decodedOutput: ethers.utils.Result | null = null
    let functionDescription: ethers.utils.TransactionDescription | null = null
    let errorDescription: IErrorDescription | null = null

    const inputSighash = inputData.slice(0, 10)
    const errorSighash = output.slice(0, 10)

    const inputFragment = this.getFragment(inputSighash)

    if (inputFragment) {
      const abiInterface = new ethers.utils.Interface([inputFragment])

      decodedInput = abiInterface.decodeFunctionData(inputFragment.name, inputData)
      functionDescription = abiInterface.parseTransaction({ data: inputData })
    }

    if (BUILTIN_ERRORS[errorSighash]) decodedOutput = this.decodeErrorResult(errorSighash, output)

    if (this.getFragment(errorSighash)) {
      const abiInterface = new ethers.utils.Interface([this.getFragment(errorSighash)])

      decodedOutput = new ethers.utils.AbiCoder().decode(this.getFragment(errorSighash).inputs, output)
      errorDescription = abiInterface.parseError(output) as IErrorDescription
    }

    return { functionDescription, errorDescription, decodedOutput, decodedInput }
  }
}
