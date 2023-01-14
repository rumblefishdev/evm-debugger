import {
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material'

export const StyledStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(4),
  alignItems: 'center',
}))
export const StyledInputWrapper = styled(Stack)(({ theme }) => ({
  width: '100%',
  gap: theme.spacing(2),
  flexDirection: 'column',
  '&:first-of-type': {
    height: '96px',
  },
}))
export const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.rfLines,
    },

    '&.Mui-focused fieldset': {
      borderWidth: '1px',
      borderColor: theme.palette.rfButton,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.rfBrandSecondary,
      '&:hover': {
        borderColor: theme.palette.rfBrandSecondary,
      },
    },
    '& input': {
      padding: theme.spacing(4),
    },
    '& fieldset': {
      borderColor: theme.palette.rfLines,
    },
  },
}))
export const StyledInputLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.label,
  textTransform: 'uppercase',
  color: theme.palette.rfSecondary,
}))
export const StyledErrorLabel = styled(StyledInputLabel)(({ theme }) => ({
  color: theme.palette.rfBrandSecondary,
}))

// Todo: style select to fit the theme

export const StyledSelect = styled(Select)(({ theme }) => ({
  // change border color
  '&.MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.rfLines,
    },

    '&.Mui-focused fieldset': {
      borderWidth: '1px',
      borderColor: theme.palette.rfButton,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.rfBrandSecondary,
      '&:hover': {
        borderColor: theme.palette.rfBrandSecondary,
      },
    },
    '& input': {
      padding: theme.spacing(4),
    },
    '& fieldset': {
      borderColor: theme.palette.rfLines,
    },
  },

  '& .MuiSelect-select': {
    padding: theme.spacing(4),
  },

  // override paper styles
  '& .MuiPaper-root': {
    borderRadius: '20px',
    border: `1px solid ${theme.palette.rfLines}`,
    backgroundColor: theme.palette.rfBrandPrimary,
  },
}))
export const StyledMenuItem = styled(MenuItem)(() => ({
  background: 'red',
}))
