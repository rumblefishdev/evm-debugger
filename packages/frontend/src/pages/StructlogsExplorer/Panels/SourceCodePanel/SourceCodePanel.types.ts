export interface ISourceCodePanelContainerProps {
  close: () => void
  source: string
}
export interface ISourceCodePanelComponentProps {
  sourceFiles: {
    sourceCode: unknown
    name: string
  }[]
  activeSourceCode: string
  close: () => void
}
