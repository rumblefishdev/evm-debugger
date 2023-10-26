import {
  StyledDataBox,
  StyledDataIndex,
  StyledDataIndexesWrapper,
  StyledDataJson,
  StyledDataWrapper,
} from '../TransactionContentDialog.styles'
import type { JsonContentBodyProps } from '../TransactionContentDialog.types'

export const JsonContentBody: React.FC<JsonContentBodyProps> = ({ content }) => {
  const lines = content.split('\n')

  return (
    <StyledDataWrapper>
      <StyledDataIndexesWrapper>
        {lines.map((_, index) => (
          <StyledDataIndex key={index}>{index}</StyledDataIndex>
        ))}
      </StyledDataIndexesWrapper>
      <StyledDataBox>
        <StyledDataJson>{content}</StyledDataJson>
      </StyledDataBox>
    </StyledDataWrapper>
  )
}
