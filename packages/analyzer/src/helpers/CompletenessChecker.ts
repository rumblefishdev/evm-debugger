import { TCompletenessData, TSighashFragment } from '@evm-debuger/types'

export class CompletnessChecker {
  private completenessData: TCompletenessData = {
    contractList: [],
    contractSighashesList: [],
  }

  public addContractAddress = (address: string) => {
    if (!this.completenessData.contractList.includes(address)) {
      this.completenessData.contractList.push(address)
    }
  }

  public addContractSighash = (address: string, sighash: string, fragment: TSighashFragment | null) => {
    const value =
      fragment !== null
        ? { sighash, addresses: new Set([address]), fragment, found: true }
        : { sighash, addresses: new Set([address]), fragment: null, found: false }

    const sighashIndex = this.completenessData.contractSighashesList.findIndex((item) => item.sighash === sighash)

    if (sighashIndex !== -1) {
      this.completenessData.contractSighashesList[sighashIndex].addresses.add(address)
    } else {
      this.completenessData.contractSighashesList.push(value)
    }
  }

  public getCompletnessData = () => {
    return { ...this.completenessData }
  }

  public getContractList = () => {
    return [...this.completenessData.contractList]
  }
}
