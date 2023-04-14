import { SourceMapContext } from "./sourceMapContext"
import { OpCode } from "./opCode";
import { SourceMapElementTree } from "./sourceMapElementTree";

type SourceMapElementProperties = '_offset' | '_length' | '_fileId' | '_jumpType'

export class SourceMapElement {
  public ids: number[]

  private readonly _opCodes: OpCode[];

  constructor(
    private readonly _offset: number,
    public readonly _length: number,
    private readonly _fileId: number,
    private readonly _jumpType: string,

    id: number | number[],

    private readonly _context: SourceMapContext,
    private readonly _sourceString: string
  ) {
    this.ids = id instanceof Array ? id : [id]

    if (this.opCodes) {

    }
  }

  get length(): number {
    return this._length
  }

  get start(): number {
    return this._offset
  }

  get end(): number {
    return this._offset + this.length
  }

  get sourceCodeFragment(): string {
    return this._context.sourceCode.substring(this.start, this.end)
  }

  get linesRange(): [number, number] {
    let startCounter = 1;
    let endCounter = 1;
    let sourceCodeStarted = false
    for (let i = 0; i < this.end; i++) {
      if (i === this.start) {
        sourceCodeStarted = true
      }

      const c = this._context.sourceCode[i]
      if (c === '\n') {
        if (!sourceCodeStarted) {
          startCounter++
        }

        endCounter++
      }
    }

    return [startCounter, endCounter]
  }

  get sourceString(): string {
    return this._sourceString
  }

  get opCodes(): OpCode[] {
    return this.ids.map(
      id => new OpCode(
        this._context.opCodes[id],
        id
      )
    )
  }

  addIds(ids: number[]) {
    this.ids = [
      ...this.ids,
      ...ids,
    ]
  }

  clone() {
    return new SourceMapElement(
      this._offset,
      this._length,
      this._fileId,
      this._jumpType,
      this.ids,
      this._context,
      this._sourceString
    )
  }

  static fromString(sourceString: string, previousElement: SourceMapElement | null, id: number, context: SourceMapContext): SourceMapElement {
    const parts = sourceString.length !== 0 ? sourceString.split(":") : []

    const offsetStr = this.getSafeField('_offset', parts, 0, previousElement)
    const lengthStr = this.getSafeField('_length', parts, 1, previousElement)
    const fileIdStr = this.getSafeField('_fileId', parts, 2, previousElement)
    const jumpType = this.getSafeField('_jumpType', parts, 3, previousElement)

    return new SourceMapElement(
      Number(offsetStr),
      Number(lengthStr),
      Number(fileIdStr),
      jumpType,
      id,
      context,
      sourceString
    )
  }

  static fromSourceMapString(sourceMapRaw: string, context: SourceMapContext): SourceMapElement[] {
    let previousElement: SourceMapElement | null = null
    const rawElements = sourceMapRaw.split(";")

    let allElements: SourceMapElement[] = []
    for (let i = 0; i < rawElements.length; i++) {
      const rawElement = rawElements[i];

      if (rawElement.length === 0 && previousElement === null) {
        continue
      }

      const element = this.fromString(rawElement, previousElement, i, context)

      allElements = [
        ...allElements,
        element
      ]

      previousElement = element
    }

    return allElements
  }

  static getJumpDestLevels(elements: SourceMapElement[]): number[] {
    let currentJumpDestLevel = 1
    return elements.flatMap(
      (element) => {
        return element.opCodes.map(
          opCode => {
            if (opCode.content === 'JUMPDEST') {
              currentJumpDestLevel++
            }

            return currentJumpDestLevel
          }
        )
      }
    )
  }

  private static getSafeField(key: SourceMapElementProperties, splitted: string[], idx: number, previousElement: SourceMapElement | null): string {
    let element: string | undefined = previousElement !== null ? previousElement[key].toString() : undefined
    if (splitted.length > idx) {
      element = splitted[idx]
    }
    if (typeof element === 'undefined') {
      throw new Error(`${key} was undefined`)
    }

    return element
  }
}