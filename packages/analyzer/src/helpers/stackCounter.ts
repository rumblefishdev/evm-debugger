export class StackCounter {
  private stackCount: number[] = []

  public visitDepth = (depth: number): number[] => {
    let copiedStackCount = [...this.stackCount]

    const index = depth - 1

    // eslint-disable-next-line no-undefined
    if (copiedStackCount[index] === undefined) copiedStackCount[index] = 0
    else {
      copiedStackCount[index] = copiedStackCount[index] + 1
      copiedStackCount = copiedStackCount.slice(0, depth)
    }

    this.stackCount = copiedStackCount

    return copiedStackCount
  }
}
