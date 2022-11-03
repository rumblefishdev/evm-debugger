import { ethers } from 'ethers'
import fetch from 'node-fetch'
import { safeJsonParse } from './helpers'

export class AbiReader {
    private savedAbis: { [key: string]: ethers.utils.Interface } = {}

    private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
        const response = await fetch(
            `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`
        )
        const text = await response.text()

        const abi = safeJsonParse(text)

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
