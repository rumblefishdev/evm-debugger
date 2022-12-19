export const BUILTIN_ERRORS: Record<string, { signature: string; inputs: string[]; name: string; reason?: boolean }> = {
  '0x4e487b71': { signature: 'Panic(uint256)', name: 'Panic', inputs: ['uint256'] },
  '0x08c379a0': { signature: 'Error(string)', name: 'Error', inputs: ['string'] },
}
