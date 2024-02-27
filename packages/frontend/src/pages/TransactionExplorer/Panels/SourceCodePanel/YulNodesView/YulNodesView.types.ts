import type { TExtendedYulNodeElement, TYulNodeBaseWithListIndex } from '../../../../../store/yulNodes/yulNodes.types'

export type TYulNodeViewComponentProps = {
  yulNodes: TExtendedYulNodeElement[]
  activeYulNode: TYulNodeBaseWithListIndex
  activeYulNodeElement: TExtendedYulNodeElement
}
