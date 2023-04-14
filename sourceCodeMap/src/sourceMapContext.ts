export class SourceMapContext {
  constructor(
    public readonly sourceCode: string,
    public readonly opCodes: string[]
  ) {
  }
}