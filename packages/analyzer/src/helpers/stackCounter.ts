export class StackCounter {
  private stackCount: number[] = []

  public visitDepth = (depth: number): number[] => {
    let copiedStackCount = [...this.stackCount]

    const index = depth - 1

    if (copiedStackCount[index]) {
      copiedStackCount[index] = copiedStackCount[index] + 1
      copiedStackCount = copiedStackCount.slice(0, depth)
    } else copiedStackCount[index] = 0

    this.stackCount = copiedStackCount

    return copiedStackCount
  }
}
