import type { TSighashStatus, TSighashFragment } from '@evm-debuger/types'

export class SigHashStatuses {
  sighashStatusList: TSighashStatus[] = []

  add(address: string, sighash: string, fragment: TSighashFragment | null) {
    const sanitizedAddress = address.toLowerCase()
    const sighashIndex = this.sighashStatusList.findIndex((item) => item.sighash === sighash)
    if (sighashIndex === -1) {
      const value =
        fragment === null
          ? {
              sighash,
              fragment: null,
              found: false,
              addresses: new Set([sanitizedAddress]),
            }
          : { sighash, fragment, found: true, addresses: new Set([sanitizedAddress]) }
      this.sighashStatusList.push(value)
    } else this.sighashStatusList[sighashIndex].addresses.add(sanitizedAddress)
  }
}
