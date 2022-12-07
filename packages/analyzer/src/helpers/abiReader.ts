import { ethers } from 'ethers'
import type { TDataProvider } from '@evm-debuger/types'

import { safeJsonParse } from './helpers'

export class AbiReader {
  constructor(private readonly dataProvider: TDataProvider) {}

  private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
    const response = await this.dataProvider.fetchAbiCode(address)

    const abi = safeJsonParse(response)

    if (abi === null || abi.result === 'Contract source code not verified') return null

    return new ethers.utils.Interface(abi.result)
  }

  public async getAbis(addressList: string[]) {
    const abis: Record<string, ethers.utils.Interface> = {}
    for (const address of addressList) {
      const abi = await this.fetchAbi(address)
      if (abi !== null) abis[address] = abi
    }

    return abis
  }
}
