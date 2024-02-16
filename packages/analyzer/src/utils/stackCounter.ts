type StackInformation = { storageAddress: string }

export class StackCounter {
  private stackCount: number[] = []
  private stackInformation: StackInformation[] = []

  public getParentStorageAddress = (depth: number = this.stackCount.length - 1): string => {
    const parentDepth = Math.max(0, depth - 1)
    return this.stackInformation.at(parentDepth).storageAddress
  }
  public visitDepth = (depth: number, address: string): number[] => {
    let copiedStackCount = [...this.stackCount]

    // eslint-disable-next-line no-undefined
    if (copiedStackCount[depth] === undefined) copiedStackCount[depth] = 0
    else {
      copiedStackCount[depth] += 1
      copiedStackCount = copiedStackCount.slice(0, depth + 1)
    }

    this.stackInformation[depth] = { storageAddress: address }
    this.stackCount = copiedStackCount

    return copiedStackCount.slice(1)
  }
}
