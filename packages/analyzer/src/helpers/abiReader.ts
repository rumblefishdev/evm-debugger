import { ethers } from 'ethers'
import type { TDataProvider, ICallTypeTraceLog } from '@evm-debuger/types'

import { decodeErrorResult, getSafeHex, safeJsonParse } from './helpers'

export class AbiReader {
    constructor(private readonly dataProvider: TDataProvider) {}

    private savedAbis: Record<string, ethers.utils.Interface> = {}

    private async fetchAbi(address: string): Promise<ethers.utils.Interface | null> {
        const response = await this.dataProvider.fetchAbiCode(address)

        const abi = safeJsonParse(response)

        if (abi.result === 'Contract source code not verified' || abi === null) return null

        return new ethers.utils.Interface(abi.result)
    }

    private async getAbi(address: string): Promise<ethers.utils.Interface | null> {
        if (this.savedAbis[address]) return this.savedAbis[address]

        const abi = await this.fetchAbi(address)

        if (abi) this.savedAbis[address] = abi

        return abi
    }
    public async decodeTraceLogInputOutput(item: ICallTypeTraceLog) {
        const { address, input, output } = item
        const indexFace = await this.getAbi(address)

        if (indexFace) {
            const decodedInput = indexFace.parseTransaction({ data: getSafeHex(input) })
            const decodedOutput = indexFace.decodeFunctionResult(decodedInput.functionFragment, getSafeHex(output))

            return { ...item, decodedOutput, decodedInput }
        }

        return item
    }

    public async decodeTraceLogErrorInputOutput(item: ICallTypeTraceLog) {
        const { address, output, input } = item
        const indexFace = await this.getAbi(address)

        if (indexFace) {
            const decodedInput = indexFace.parseTransaction({ data: getSafeHex(input) })

            const decodedOutput = decodeErrorResult(getSafeHex(output))

            return { ...item, decodedOutput, decodedInput }
        }

        return item
    }
}
