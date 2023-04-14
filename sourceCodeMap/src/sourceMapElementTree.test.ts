import { SourceMapElementTreeNode, SourceMapElementTree } from "./sourceMapElementTree"
import { SourceMapElement } from "./sourceMapElement";
import { SourceMapContext } from "./sourceMapContext"

describe("SourceMapElementTreeNode", () => {
  describe("addChild", () => {
    let nodes: SourceMapElementTreeNode[]

    beforeEach(() => {
      const context = new SourceMapContext(
        "",
        ["", "", ""]
      )
      const els = [
        SourceMapElement.fromString("10:30:0:1", null, 0, context),
        SourceMapElement.fromString("12:10:0:1", null, 1, context),
        SourceMapElement.fromString("13:5:0:1", null, 2, context)
      ]

      nodes = els.map(
        (el, idx) => new SourceMapElementTreeNode(
          el
        )
      )
    })

    it("works", () => {
      nodes[1].parent = nodes[0]
      nodes[0].children.push(nodes[1])

      nodes[0].addChild(nodes[2])
      expect(nodes[0].children).toHaveLength(2)
    })

    it("can replace parent of node", () => {
      nodes[1].parent = nodes[0]
      nodes[0].children.push(nodes[1])
      nodes[2].parent = nodes[1]
      nodes[1].children.push(nodes[2])

      nodes[0].addChild(nodes[2])
      expect(nodes[0].children).toHaveLength(2)
      expect(nodes[2].parent).toBe(nodes[0])
      expect(nodes[1].children).toHaveLength(0)
    })
  })
})

describe("SourceMapElementTree", () => {
  let nodes: SourceMapElementTreeNode[]


  beforeEach(() => {
    const sourceCode = `contract A {
    function b() public pure returns(uint256) {
        return 1730;
    }

    function c() public payable returns(uint256) {
        revert("NO MORE");
    }
    }`

    const opCodes = [
      "ADD",
      "JUMP",
      "GASLIMIT",
      "PUSH20",
      "STOP",
      "POP"
    ]

    const context = new SourceMapContext(
      sourceCode,
      opCodes
    )

    const els = [
      SourceMapElement.fromString("0:178:0:1", null, 0, context),
      SourceMapElement.fromString("17:70:0:1", null, 1, context),
      SourceMapElement.fromString("69:12:0:1", null, 2, context),
      SourceMapElement.fromString("17:70:0:1", null, 3, context),
      SourceMapElement.fromString("19:70:0:1", null, 4, context),
      SourceMapElement.fromString("76:4:0:1", null, 5, context),
    ]

    nodes = els.map(
      (el, idx) => new SourceMapElementTreeNode(
        el
      )
    )
  })

  describe("addNewNode", () => {
    it("can construct linear tree", () => {
      const tree = new SourceMapElementTree(
        nodes[0]
      )

      tree.addNewNode(nodes[1])
      tree.addNewNode(nodes[2])

      expect(tree.rootNode).toBe(nodes[0])
      expect(tree.rootNode.children).toHaveLength(1)
      expect(tree.rootNode.children[0]).toBe(nodes[1])
      expect(tree.rootNode.children[0].parent).toBe(nodes[0])
      expect(tree.rootNode.children[0].children).toHaveLength(1)
      expect(tree.rootNode.children[0].children[0]).toBe(nodes[2])
      expect(tree.rootNode.children[0].children[0].parent).toBe(nodes[1])
    })

    it("can reorganize tree", () => {
      const tree = new SourceMapElementTree(
        nodes[0]
      )

      tree.addNewNode(nodes[2])
      tree.addNewNode(nodes[1])

      expect(tree.rootNode).toBe(nodes[0])
      expect(tree.rootNode.children).toHaveLength(1)
      expect(tree.rootNode.children[0]).toBe(nodes[1])
      expect(tree.rootNode.children[0].parent).toBe(nodes[0])
      expect(tree.rootNode.children[0].children).toHaveLength(1)
      expect(tree.rootNode.children[0].children[0]).toBe(nodes[2])
      expect(tree.rootNode.children[0].children[0].parent).toBe(nodes[1])
    })

    it("it will only add id for the same node", () => {
      const tree = new SourceMapElementTree(
        nodes[0]
      )

      tree.addNewNode(nodes[1])
      tree.addNewNode(nodes[2])
      tree.addNewNode(nodes[3])

      expect(tree.rootNode).toBe(nodes[0])
      expect(tree.rootNode.children).toHaveLength(1)
      expect(tree.rootNode.children[0]).toBe(nodes[1])
      expect(tree.rootNode.children[0].parent).toBe(nodes[0])
      expect(tree.rootNode.children[0].children).toHaveLength(1)
      expect(tree.rootNode.children[0].children[0]).toBe(nodes[2])
      expect(tree.rootNode.children[0].children[0].parent).toBe(nodes[1])

      expect(nodes[1].element.ids).toEqual([1,3])
    })

    it("add existing subnodes to shifted nodes", () => {
      const tree = new SourceMapElementTree(
        nodes[0]
      )

      tree.addNewNode(nodes[1])
      tree.addNewNode(nodes[2])
      tree.addNewNode(nodes[4])

      expect(tree.rootNode).toBe(nodes[0])
      expect(tree.rootNode.children).toHaveLength(2)

      expect(tree.rootNode.children[0]).toBe(nodes[1])
      expect(tree.rootNode.children[0].parent).toBe(nodes[0])
      expect(tree.rootNode.children[0].children).toHaveLength(1)
      expect(tree.rootNode.children[0].children[0]).toBe(nodes[2])
      expect(tree.rootNode.children[0].children[0].parent).toBe(nodes[1])

      expect(tree.rootNode.children[1]).toBe(nodes[4])
      expect(tree.rootNode.children[1].parent).toBe(nodes[0])
      expect(tree.rootNode.children[1].children).toHaveLength(0)
    })

    it("can handle two roots", () => {
      const tree = new SourceMapElementTree(
        nodes[1]
      )

      tree.addNewNode(nodes[4])


      expect(tree.rootNode).toBe(nodes[1])
      expect(tree.rootNode.children).toHaveLength(0)
    })
  })

  describe("shrinkTree", () => {
    it("works", () => {
      const tree = new SourceMapElementTree(
        nodes[0]
      )

      for (const node of [nodes[1], nodes[2], nodes[5]]) {
        tree.addNewNode(node)
      }

      const shrunkTree = tree.shrinkTree()
      expect(shrunkTree.rootNode.uniqueId).toEqual(nodes[0].uniqueId)
      expect(shrunkTree.rootNode.children).toHaveLength(1)
      expect(shrunkTree.rootNode.children[0].uniqueId).toEqual(nodes[1].uniqueId)
      expect(shrunkTree.rootNode.children[0].children).toHaveLength(1)
      expect(shrunkTree.rootNode.children[0].children[0].uniqueId).toEqual(nodes[2].uniqueId)
      expect(shrunkTree.rootNode.children[0].children[0].children).toHaveLength(0)
    })
  })
})