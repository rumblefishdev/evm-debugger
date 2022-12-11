import { TCompletenessData, TSighashFragment } from '@evm-debuger/types'

export class CompletnessChecker {
  private completenessData: TCompletenessData = {
    contractList: [],
    contractSighashesList: {},
  }

  public addContractAddress = (address: string) => {
    if (!this.completenessData.contractList.includes(address)) {
      this.completenessData.contractList.push(address)
      this.completenessData.contractSighashesList[address] = []
    }
  }

  public addContractSighash = (address: string, sighash: string, fragment: TSighashFragment | null) => {
    if (!this.completenessData.contractSighashesList[address].find((item) => item.sighash === sighash)) {
      const value = fragment !== null ? { sighash, fragment, found: true } : { sighash, fragment: null, found: false }
      this.completenessData.contractSighashesList[address].push(value)
    }
  }

  public getCompletnessData = () => {
    return { ...this.completenessData }
  }

  public getContractList = () => {
    return [...this.completenessData.contractList]
  }
}
