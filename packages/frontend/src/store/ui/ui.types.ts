export interface IUIState {
  structLogsListOffset: number
  shouldShowProgressScreen: boolean
  shouldShowFunctionStackTrace: boolean
  displaySolcMiddlewares: boolean
  displayYulFunctions: boolean
  currentFunctionParameterId: string | null
}
