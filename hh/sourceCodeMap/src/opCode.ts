export class OpCode {
  constructor(
    public readonly content: string,
    public readonly line: number
  ) {
  }

  toString(): string {
    return `${this.line}: ${this.content}`
  }
}