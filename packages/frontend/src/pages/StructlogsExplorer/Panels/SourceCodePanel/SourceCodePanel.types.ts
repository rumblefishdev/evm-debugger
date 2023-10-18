export type TSourceFiles = {
  sourceCode: unknown
  name: string
}

export interface ISourceCodePanelContainerProps {
  close: () => void
  source: string
}
export interface ISourceCodePanelComponentProps {
  sourceFiles: TSourceFiles[]
  activeSourceCode: string
  close: () => void
}
