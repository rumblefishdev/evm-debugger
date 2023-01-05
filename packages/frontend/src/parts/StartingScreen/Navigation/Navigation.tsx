import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ROUTES } from '../../../router'

import type { NavigationProps } from './Navigation.types'
import { StyledStack, StyledTab, StyledTabs } from './styles'

export const Navigation = ({ children, ...props }: NavigationProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [value, setValue] = useState<ROUTES | string>(location.pathname)

  const handleChange = (event: React.SyntheticEvent, nextValue: ROUTES) => {
    setValue(nextValue)
  }

  const handleTabClick = (tabName: ROUTES) => {
    navigate(tabName)
  }

  console.log('ppppppppppppppppppppppppppppppppppppppppppppppppp')

  return (
    <StyledStack {...props}>
      <StyledTabs value={value} onChange={handleChange} centered>
        <StyledTab label="Supported Chain" value={ROUTES.HOME} onClick={() => handleTabClick(ROUTES.HOME)} />
        <StyledTab label="Manual Upload" value={ROUTES.MANUAL_UPLOAD} onClick={() => handleTabClick(ROUTES.MANUAL_UPLOAD)} />
      </StyledTabs>
      {children}
    </StyledStack>
  )
}
