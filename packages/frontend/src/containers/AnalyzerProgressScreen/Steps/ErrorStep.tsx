import { Link, Step, StepLabel, Typography, useTheme } from '@mui/material'
import React from 'react'

import { Error } from '../../../icons'
import { reportIssuePageUrl } from '../../../config'

import type { AnalyzerStepProps } from './types'

export const ErrorStep = ({ errorMessage, stepName, ...props }: AnalyzerStepProps) => {
  const theme = useTheme()

  const stepLabelProps = {
    optional: (
      <Typography
        align={'left'}
        variant="caption"
        color={theme.palette.rfBrandSecondary}
      >
        {errorMessage}
        <div>
          <b>
            <Link
              color="inherit"
              href={reportIssuePageUrl}
            >
              Found a bug? Click to raise an issue.
            </Link>
          </b>
        </div>
      </Typography>
    ),
  }

  return (
    <Step
      {...props}
      key={stepName}
    >
      <StepLabel
        icon={<Error />}
        error
        {...stepLabelProps}
      >
        {stepName}
      </StepLabel>
    </Step>
  )
}
