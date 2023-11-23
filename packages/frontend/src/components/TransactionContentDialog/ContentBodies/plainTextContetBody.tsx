import {
  StyledBytecode,
  StyledDataBox,
  StyledDataIndex,
  StyledDataIndexesWrapper,
  StyledDataWrapper,
} from '../TransactionContentDialog.styles'
import type { PlainTextContentBodyProps } from '../TransactionContentDialog.types'

export const PlainTextContentBody: React.FC<PlainTextContentBodyProps> = ({ content }) => {
  const lines = Array.from({ length: content.length / 67 + 1 })

  return (
    <StyledDataWrapper>
      <StyledDataIndexesWrapper>
        {lines.map((_, index) => (
          <StyledDataIndex key={index}>{index}</StyledDataIndex>
        ))}
      </StyledDataIndexesWrapper>
      <StyledDataBox>
        <StyledBytecode>{content}</StyledBytecode>
      </StyledDataBox>
    </StyledDataWrapper>
  )
}
