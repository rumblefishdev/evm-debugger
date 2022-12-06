import { ethers } from 'ethers'

import { cachedAbis } from '../../resources/predefinedAbis'

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

    if (!fragment) return { decodedOutput: null, decodedInput: null }

    const abiInterface = new ethers.utils.Interface([fragment])

    const decodedInput = abiInterface.decodeFunctionData(fragment.name, inputData)
    const decodedOutput = abiInterface.decodeFunctionResult(fragment.name, outputData)

    return { decodedOutput, decodedInput }
  }

  public decodeFragmentWithError(inputData: string, output: string) {
    const inputSighash = inputData.slice(0, 10)
    const errorSighash = output.slice(0, 10)

    const inputFragment = this.getFragment(inputSighash)
    const errorFragment = this.getFragment(errorSighash)

    if (!inputFragment && !errorFragment) return { decodedOutput: null, decodedInput: null }

    if (!inputFragment) {
      const abiInterface = new ethers.utils.Interface([errorFragment])

      const decodedOutput = abiInterface.decodeFunctionResult(errorFragment.name, output)

      return { decodedOutput, decodedInput: null }
    }

    if (!errorFragment) {
      const abiInterface = new ethers.utils.Interface([inputFragment])

      const decodedInput = abiInterface.decodeFunctionData(inputFragment.name, inputData)

      return { decodedOutput: null, decodedInput }
    }

    const abiInterface = new ethers.utils.Interface([inputFragment, errorFragment])

    const decodedInput = abiInterface.decodeFunctionData(inputFragment.name, inputData)
    const decodedOutput = abiInterface.decodeErrorResult(errorFragment.name, output)

    return { decodedOutput, decodedInput }
  }
}
