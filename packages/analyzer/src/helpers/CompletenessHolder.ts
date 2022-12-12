import { TCompletenessData, TSighashFragment } from '@evm-debuger/types'

export class CompletenessHolder {
  private completenessData: TCompletenessData = {
    contractList: [],
    contractSighashesList: {},
  }

  public addContractSighash = (address: string, sighash: string, fragment: TSighashFragment | null) => {
    if (!this.completenessData.contractSighashesList[address].find((item) => item.sighash === sighash)) {
      const value = fragment !== null ? { sighash, fragment, found: true } : { sighash, fragment: null, found: false }
      this.completenessData.contractSighashesList[address].push(value)
    }
  }
}
