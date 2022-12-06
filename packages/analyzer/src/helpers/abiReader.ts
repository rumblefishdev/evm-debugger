import { ethers } from 'ethers'
import type { TDataProvider } from '@evm-debuger/types'

import { safeJsonParse } from './helpers'

export class AbiReader {
  constructor(private readonly dataProvider: TDataProvider) {}

  private savedAbis: Record<string, ethers.utils.Interface> = {}
  private notVerifiedContracts: Set<string> = new Set()

  private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
    const response = await this.dataProvider.fetchAbiCode(address)

    const abi = safeJsonParse(response)

    if (abi.result === 'Contract source code not verified' || abi === null) return null

    return new ethers.utils.Interface(abi.result)
  }

  public async fetchFromAllContracts(addressList: string[]) {
    for (const address of addressList) {
      const abi = await this.fetchAbi(address)
      if (abi !== null) this.savedAbis[address] = abi
      this.notVerifiedContracts.add(address)
    }
  }

  public getAbis() {
    return this.savedAbis
  }
}
