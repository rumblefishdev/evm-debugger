export class Counter {
    private count: number[] = []

    public getCount = (depth: number) => {
        let count = [...this.count]

        const index = depth - 1

        if (count[index] === undefined) {
            count[index] = 0
        } else {
            count[index] = count[index] + 1
            count = count.slice(0, depth)
        }

        this.count = count

        return count
    }
}
