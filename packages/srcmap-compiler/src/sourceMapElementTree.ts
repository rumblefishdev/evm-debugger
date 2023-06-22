/* eslint-disable unicorn/no-keyword-prefix */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-use-before-define */
import type { SourceMapElement } from './sourceMapElement'
import type { OpCode } from './opCode'

export class SourceMapElementTreeNode {
  public parent: SourceMapElementTreeNode | null | undefined
  public children: SourceMapElementTreeNode[]

  constructor(public readonly element: SourceMapElement) {
    this.children = []
  }

  get opCodes(): OpCode[] {
    return this.element.opCodes
  }

  addIds(ids: number[]) {
    this.element.addIds(ids)
  }

  addChild(node: SourceMapElementTreeNode) {
    this.children = [...this.children, node]

    if (node.parent) {
      const index = node.parent.children.findIndex(
        (child) => child.uniqueId === node.uniqueId,
      )
      if (index !== -1) node.parent.children.splice(index)
    }

    node.parent = this
  }

  removeChild(node: SourceMapElementTreeNode): SourceMapElementTreeNode | null {
    const index = this.children.findIndex(
      (child) => child.uniqueId === node.uniqueId,
    )
    if (index > -1) {
      const childNodeToRemove = this.children[index]

      this.children.splice(index)
      childNodeToRemove.parent = null
      return childNodeToRemove
    }

    return null
  }

  isEqual(node: SourceMapElementTreeNode): boolean {
    return (
      this.element.start === node.element.start &&
      this.element.end === node.element.end
    )
  }

  isNodeParent(node: SourceMapElementTreeNode): boolean {
    return (
      !this.isEqual(node) &&
      this.element.start <= node.element.start &&
      this.element.end >= node.element.end
    )
  }

  isNodeChild(node: SourceMapElementTreeNode): boolean {
    return (
      !this.isEqual(node) &&
      this.element.start >= node.element.start &&
      this.element.end <= node.element.end
    )
  }

  get allSubNodesAndItself(): SourceMapElementTreeNode[] {
    return [
      this,
      ...this.children.flatMap((child) => child.allSubNodesAndItself),
    ]
  }

  get uniqueId(): string {
    return `${this.element.start}-${this.element.end}`
  }

  clone(): SourceMapElementTreeNode {
    return new SourceMapElementTreeNode(this.element)
  }
}

export class SourceMapElementTree {
  constructor(public rootNode: SourceMapElementTreeNode) {}

  findClosestParentNode(
    node: SourceMapElementTreeNode,
  ): SourceMapElementTreeNode | null {
    const parentNodes = this.rootNode.allSubNodesAndItself.filter((subNode) => {
      return subNode.isNodeParent(node)
    })
    if (parentNodes.length === 0) return null

    let bestParentNode = parentNodes[0]
    for (const parentNode of parentNodes.slice(1))
      if (bestParentNode.element.length > parentNode.element.length)
        bestParentNode = parentNode

    return bestParentNode
  }

  addNewNode(nodeToAdd: SourceMapElementTreeNode) {
    const directParent = this.findClosestParentNode(nodeToAdd)

    if (directParent === null) {
      if (this.rootNode.isNodeChild(nodeToAdd)) {
        nodeToAdd.addChild(this.rootNode)
        this.rootNode = nodeToAdd
      } else if (this.rootNode.isEqual(nodeToAdd))
        this.rootNode.addIds(nodeToAdd.element.ids)

      return
    }

    let foundEqualNode = false
    for (const directParentChild of directParent.children)
      if (directParentChild.isEqual(nodeToAdd)) {
        directParentChild.addIds(nodeToAdd.element.ids)
        foundEqualNode = true
        break
      }

    if (!foundEqualNode) {
      for (const child of directParent.children)
        if (nodeToAdd.isNodeParent(child) && child.parent) {
          // eslint-disable-next-line unicorn/prefer-dom-node-remove
          const removedChild = child.parent.removeChild(child)
          nodeToAdd.addChild(removedChild as SourceMapElementTreeNode)
        }

      directParent.addChild(nodeToAdd)
    }
  }

  iterator(): Generator<SourceMapElementTreeNode> {
    return this.nodeIterator(this.rootNode)
  }

  toString(): string {
    return this.printChildren(this.rootNode, 1)
  }

  shrinkTree(): SourceMapElementTree {
    return this
  }

  static fromElements(elements: SourceMapElement[]) {
    const tree = new SourceMapElementTree(
      new SourceMapElementTreeNode(elements[0]),
    )

    for (let index = 1; index < elements.length; index++) {
      const newNode = new SourceMapElementTreeNode(elements[index])
      tree.addNewNode(newNode)
    }

    return tree
  }

  private printChildren(
    node: SourceMapElementTreeNode,
    tabsNumber: number,
  ): string {
    const [startLine, endLine] = node.element.linesRange
    let result =
      `|${'-'.repeat(tabsNumber)}>${node.element.start}:${
        node.element.end
      } (${startLine}:${endLine})\n` +
      `----- SOURCE CODE ------ \n ${node.element.sourceCodeFragment}\n` +
      `----- OP CODES -------------\n${node.opCodes
        .map((opCode) => opCode.toString())
        .join('\n')}\n`
    for (const childNode of node.children)
      result += this.printChildren(childNode, tabsNumber + 2)

    return result
  }

  private *nodeIterator(
    node: SourceMapElementTreeNode,
  ): Generator<SourceMapElementTreeNode> {
    yield node

    for (const child of node.children) yield* this.nodeIterator(child)
  }
}
