export interface IUIState {
  structLogsListOffset: number
  shouldShowProgressScreen: boolean
  shouldShowFunctionStackTrace: boolean
  displayNonMainFunctions: boolean
  displayYulFunctions: boolean
  currentFunctionParameterId: string | null
}
