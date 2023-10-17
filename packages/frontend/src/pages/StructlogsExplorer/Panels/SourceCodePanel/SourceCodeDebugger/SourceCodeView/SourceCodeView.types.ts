export interface ISourceCodeViewProps {
  contractName: string
  activeSourceCode: string
  startCodeLine: number
  endCodeLine: number
}

export interface ISourceCodeViewContainerProps {
  activeSourceCode: string
}
