import { SrcMapStatus } from '@evm-debuger/types'

export const convertAddressesToStatuses = (addresses: string[]): Record<string, SrcMapStatus> =>
  addresses.reduce((accumulator, address) => {
    accumulator[address] = SrcMapStatus.PENDING
    return accumulator
  }, {})
