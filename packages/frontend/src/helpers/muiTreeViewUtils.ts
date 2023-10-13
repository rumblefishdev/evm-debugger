export interface MuiTreeViewNode {
  id: string
  name: string
  children?: MuiTreeViewNode[]
}

export const parsePathsToMuiTreeView = (paths: string[]): MuiTreeViewNode[] => {
  return paths.reduce((tree: MuiTreeViewNode[], path: string) => {
    const segments = path.split('/')
    let currentSegment = ''
    let currentChildren = tree

    segments.forEach((pathSegment) => {
      currentSegment += `/${pathSegment}`

      const existingNode = currentChildren.find((node) => node.id === currentSegment)

      if (existingNode) {
        currentChildren = existingNode.children
        return
      }

      currentChildren.push({
        name: pathSegment,
        id: currentSegment,
        children: [],
      })
      currentChildren = currentChildren.at(-1).children
    })

    return tree
  }, [] as MuiTreeViewNode[])
}

export const getExpandedNodes = (paths: string[], expanded: string[] = [], root = '/'): string[] => {
  const toggledSet: Set<string> = new Set(expanded)
  toggledSet.add(root)

  paths.forEach((path) => {
    const segments = path.split('/')
    let currentSegment = ''

    segments.forEach((pathSegment) => {
      currentSegment += `/${pathSegment}`
      toggledSet.add(currentSegment)
    })
  })
  return Array.from(toggledSet)
}

export const getNodeIdByPath = (path: string): string => {
  return path ? `/${path}` : '' // id must start with a slash
}

export const getPathByNodeId = (nodeId: string): string => {
  return nodeId ? nodeId.slice(1) : '' // remove the leading slash
}
