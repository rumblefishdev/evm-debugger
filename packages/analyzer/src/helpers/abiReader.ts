import { ethers } from 'ethers'
import { TDataProvider } from '@evm-debuger/types'
import { ICallTypeTraceLog } from '@evm-debuger/types'
import { decodeErrorResult, getSafeHex, safeJsonParse } from './helpers'

export class AbiReader {
    constructor(private readonly dataProvider: TDataProvider) {}

    private savedAbis: { [key: string]: ethers.utils.Interface } = {}

    private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
        const response = await this.dataProvider.fetchAbiCode(address)

        const abi = safeJsonParse(response)

        if (abi.result === 'Contract source code not verified' || abi === null) {
            return null
        }

        return new ethers.utils.Interface(abi.result)
    }

    private async getAbi(address: string): Promise<ethers.utils.Interface | null> {
        if (this.savedAbis[address]) {
            return this.savedAbis[address]
        }

        const abi = await this.fetchAbi(address)

        if (abi) {
            this.savedAbis[address] = abi
        }

        return abi
    }
    public async decodeTraceLogInputOutput(item: ICallTypeTraceLog) {
        const { address, input, output } = item
        const iFace = await this.getAbi(address)

        if (iFace) {
            const decodedInput = iFace.parseTransaction({ data: getSafeHex(input) })
            const decodedOutput = iFace.decodeFunctionResult(decodedInput.functionFragment, getSafeHex(output))

            return { ...item, decodedInput, decodedOutput }
        }

        return item
    }

    public async decodeTraceLogErrorInputOutput(item: ICallTypeTraceLog) {
        const { address, output, input } = item
        const iFace = await this.getAbi(address)

        if (iFace) {
            const decodedInput = iFace.parseTransaction({ data: getSafeHex(input) })

            const decodedOutput = decodeErrorResult(getSafeHex(output))

            return { ...item, decodedInput, decodedOutput }
        }

        return item
    }
}
