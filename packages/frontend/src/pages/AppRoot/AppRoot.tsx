import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { analyzerSelectors } from '../../store/analyzer/analyzer.selectors'
import { algaeTheme } from '../../theme/algaeTheme'
import { defaultTheme } from '../../theme/default'
import { AppNavigation } from '../../layouts/AppNavigation/AppNavigation.component'
import { AnalyzerProgressScreen } from '../../containers/AnalyzerProgressScreen/AnalyzerProgressScreen'
import { AppContainer } from '../../layouts/AppContainer/AppContainer.component'

export const AppRoot: React.FC = () => {
  const isAnalyzerSuccessfullyFinished = useSelector(analyzerSelectors.selectIsAnalyzerSuccessfullyFinished)

  return (
    <ThemeProvider theme={algaeTheme}>
      {isAnalyzerSuccessfullyFinished && <AppNavigation />}
      <AppContainer withNavbar>
        <ThemeProvider theme={defaultTheme}>{isAnalyzerSuccessfullyFinished ? <Outlet /> : <AnalyzerProgressScreen />}</ThemeProvider>
      </AppContainer>
    </ThemeProvider>
  )
}
