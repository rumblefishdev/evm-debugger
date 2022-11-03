import { ethers } from 'ethers'
import { safeJsonParse } from './helpers'
import { IDataProvider } from './types'

export class AbiReader {
    constructor(private readonly dataProvider: IDataProvider) {}

    private savedAbis: { [key: string]: ethers.utils.Interface } = {}

    private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
        const response = await this.dataProvider.fetchAbiCode(address)

        const abi = safeJsonParse(response)

        if (abi.result === 'Contract source code not verified' || abi === null) {
            return null
        }

        return new ethers.utils.Interface(abi.result)
    }

    public async getAbi(address: string): Promise<ethers.utils.Interface | null> {
        if (this.savedAbis[address]) {
            return this.savedAbis[address]
        }

        const abi = await this.fetchAbi(address)

        if (abi) {
            this.savedAbis[address] = abi
        }

        return abi
    }
}
