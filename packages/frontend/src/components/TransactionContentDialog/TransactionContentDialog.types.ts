import type { DialogProps } from '@mui/material'

export interface TransactionContentDialogProps extends DialogProps {
  title: string
  description?: string
  content?: string
  contentType?: 'json' | 'solidity' | 'plain_text'
}

export interface JsonContentBodyProps {
  content: string
}

export interface SolidityContentBodyProps {
  content: string
  contractName: string
}

export interface PlainTextContentBodyProps {
  content: string
}
