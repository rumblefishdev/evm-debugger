export class StackCounter {
    private stackCount: number[] = []

    public visitDepth = (depth: number): number[] => {
        let newStackCount = [...this.stackCount]

        const index = depth - 1

        if (newStackCount[index] === undefined) newStackCount[index] = 0
        else {
            newStackCount[index] = newStackCount[index] + 1
            newStackCount = newStackCount.slice(0, depth)
        }

        this.stackCount = newStackCount

        return newStackCount
    }
}
