import { TSighashStatus, TSighashFragment } from '@evm-debuger/types'

export class SigHashStatuses {
  sighashStatusList: TSighashStatus[] = []

  add(address: string, sighash: string, fragment: TSighashFragment | null) {
    const sighashIndex = this.sighashStatusList.findIndex((item) => item.sighash === sighash)
    if (sighashIndex === -1) {
      const value =
        fragment !== null
          ? { sighash, addresses: new Set([address]), fragment, found: true }
          : { sighash, addresses: new Set([address]), fragment: null, found: false }
      this.sighashStatusList.push(value)
    } else {
      this.sighashStatusList[sighashIndex].addresses.add(address)
    }
  }
}
