import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { analyzerSelectors } from '../../store/analyzer/analyzer.selectors'
import { algaeTheme } from '../../theme/algaeTheme'
import { defaultTheme } from '../../theme/default'
import { AppNavigation } from '../../containers/AppNavigation/AppNavigation.container'
import { AnalyzerProgressScreen } from '../../containers/AnalyzerProgressScreen/AnalyzerProgressScreen'
import { AppContainer } from '../../layouts/AppContainer/AppContainer.component'
import { uiSelectors } from '../../store/ui/ui.selectors'

export const AppRoot: React.FC = () => {
  const isAnalyzerSuccessfullyFinished = useSelector(analyzerSelectors.selectIsAnalyzerSuccessfullyFinished)
  const shouldShowAnalyzerProgressScreen = useSelector(uiSelectors.selectShouldShowProgressScreen)

  const shouldDisplayApp = isAnalyzerSuccessfullyFinished && !shouldShowAnalyzerProgressScreen

  return (
    <ThemeProvider theme={algaeTheme}>
      {shouldDisplayApp && <AppNavigation />}
      <AppContainer
        withNavbar
        sx={shouldDisplayApp ? { minWidth: '900px' } : undefined}
      >
        <ThemeProvider theme={defaultTheme}>{shouldDisplayApp ? <Outlet /> : <AnalyzerProgressScreen />}</ThemeProvider>
      </AppContainer>
    </ThemeProvider>
  )
}
