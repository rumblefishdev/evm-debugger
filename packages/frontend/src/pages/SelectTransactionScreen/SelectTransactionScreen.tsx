import React from 'react'
import { Box, Card, CardContent, Tab, Tabs } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'

import { ManualUploadTransactionScreen } from './ManualUploadTransactionScreen'
import { SelectTransactionTabPanel } from './SelectTransactionTabPanel/SelectTransactionTabPanel'
import { SupportedChainsTransactionScreen } from './SupportedChainsTransactionScreen'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const SelectTransactionScreen = () => {
  const [value, setValue] = React.useState(1)

  const handleChange = (event: React.SyntheticEvent, valueToSet: number) => {
    setValue(valueToSet)
  }

  return (
    <Grid2 container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100%' }}>
      <Grid2>
        <Card sx={{ width: 1000, height: 500 }}>
          <CardContent>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderColor: 'divider', borderBottom: 1 }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="SUPPORTED CHAINS" {...a11yProps(0)} />
                  <Tab label="MANUAL UPLOAD" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <SelectTransactionTabPanel index={0} value={value}>
                <SupportedChainsTransactionScreen />
              </SelectTransactionTabPanel>
              <SelectTransactionTabPanel index={1} value={value}>
                <ManualUploadTransactionScreen />
              </SelectTransactionTabPanel>
            </Box>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  )
}
