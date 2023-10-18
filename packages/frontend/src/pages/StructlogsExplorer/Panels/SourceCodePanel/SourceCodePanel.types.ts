export interface ISourceCodePanelContainerProps {
  close: () => void
}
export interface ISourceCodePanelComponentProps {
  sourceFiles: {
    sourceCode: unknown
    name: string
  }[]
  activeSourceCode: string
  close: () => void
}
