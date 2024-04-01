import type { ROUTES } from '../../routes'

export type TAppNavigationComponentProps = {
  convertNavigationTabName: (tabName: ROUTES) => string
  handleTabChange: (tabName: ROUTES) => void
  activeTabName: string
  showAnalyzerLogs: () => void
  toggleFunctionStackTrace: () => void
  isFunctionStackTraceVisible: boolean
}
