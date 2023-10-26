import React from 'react'

import {
  StyledTransactionContentDialog,
  StyledDescription,
  StyledHeader,
  StyledStack,
  StyledTitle,
} from './TransactionContentDialog.styles'
import type { TransactionContentDialogProps } from './TransactionContentDialog.types'
import { JsonContentBody } from './ContentBodies/jsonContentBody'
import { PlainTextContentBody } from './ContentBodies/plainTextContetBody'
import { SolidityContentBody } from './ContentBodies/solidityContentBody'

const ContentBody: React.FC<Pick<TransactionContentDialogProps, 'content' | 'contentType' | 'title'>> = ({
  contentType,
  title,
  content,
}) => {
  switch (contentType) {
    case 'json':
      return <JsonContentBody content={content} />
    case 'plain_text':
      return <PlainTextContentBody content={content} />
    case 'solidity':
      return (
        <SolidityContentBody
          content={content}
          contractName={title}
        />
      )
    default:
      return null
  }
}

export const TransactionContentDialog: React.FC<TransactionContentDialogProps> = ({
  title,
  description,
  content,
  contentType,
  ...props
}) => {
  return (
    <StyledTransactionContentDialog {...props}>
      <StyledStack>
        <StyledHeader>
          <StyledTitle>Result for {title}</StyledTitle>
          {description ? <StyledDescription>{description}</StyledDescription> : null}
        </StyledHeader>

        <ContentBody
          content={content}
          contentType={contentType}
          title={title}
        />
      </StyledStack>
    </StyledTransactionContentDialog>
  )
}
