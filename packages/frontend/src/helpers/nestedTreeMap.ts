// TODO: refactor so congitive-complexity is less than 15
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type {
  TIntrinsicLog,
  TMainTraceLogsWithId,
  TTreeMapItemWithoutNested,
} from '../types'

import { sumReducer } from './helpers'

export class NestedMap {
  constructor(
    private width: number,
    private height: number,
    private items: (TMainTraceLogsWithId | TIntrinsicLog)[],
  ) {
    this.items = [...items]
  }

  private margin = 8

  private currentWidth = this.margin * 2
  private currentHeight = this.margin * 2

  private stageValue = 0
  private stageBlocks: TTreeMapItemWithoutNested[] = []

  private placedBlocks: TTreeMapItemWithoutNested[] = []

  private lastAspectRatio = 0

  private calculateAspectRatio(width: number, height: number) {
    return Math.max(height / width, width / height)
  }
  private sortDescendingByGas() {
    this.items.sort((a, b) => b.gasCost - a.gasCost)
  }

  private isWorseRatio(currentAspect: number) {
    return Math.abs(1 - currentAspect) > Math.abs(1 - this.lastAspectRatio)
  }

  private placeBlock(
    item: TMainTraceLogsWithId | TIntrinsicLog,
    index: number,
  ) {
    const isVertical =
      this.width - this.currentWidth > this.height - this.currentHeight

    const mapArea =
      (this.height - this.currentHeight) * (this.width - this.currentWidth)

    const itemArea =
      mapArea *
      (item.gasCost /
        this.items
          .slice(index)
          .map((block) => block.gasCost)
          .reduce(sumReducer, 0))

    const blockData: TTreeMapItemWithoutNested = {
      item,
      dimensions: {
        y: this.currentHeight - this.margin * 1.25,
        x: this.currentWidth - this.margin * 1.25,
        width: 0,
        height: 0,
      },
    }

    const gasPercentage =
      item.gasCost /
      (this.stageBlocks.reduce(
        (accumulator, element) => accumulator + element.item.gasCost,
        0,
      ) +
        item.gasCost)

    if (isVertical) {
      blockData.dimensions.height =
        (this.height - this.currentHeight) * gasPercentage
      blockData.dimensions.width = itemArea / blockData.dimensions.height
    } else {
      blockData.dimensions.width =
        (this.width - this.currentWidth) * gasPercentage
      blockData.dimensions.height = itemArea / blockData.dimensions.width
    }

    if (this.stageBlocks.length === 0) {
      this.placedBlocks.push(blockData)
      this.stageBlocks.push(blockData)
      this.lastAspectRatio = this.calculateAspectRatio(
        blockData.dimensions.width,
        blockData.dimensions.height,
      )
      if (isVertical)
        this.stageValue += blockData.dimensions.width + this.margin

      if (!isVertical)
        this.stageValue += blockData.dimensions.height + this.margin

      return
    }

    const currentAspect = this.calculateAspectRatio(
      blockData.dimensions.width,
      blockData.dimensions.height,
    )
    if (this.isWorseRatio(currentAspect)) {
      if (isVertical) {
        this.placedBlocks.at(-1).dimensions.width -= this.margin
        this.currentWidth += this.stageValue - this.margin
      }
      if (!isVertical) {
        this.placedBlocks.at(-1).dimensions.height -= this.margin
        this.currentHeight += this.stageValue - this.margin
      }

      this.lastAspectRatio = currentAspect
      this.stageValue = 0
      this.stageBlocks = []
      this.placeBlock(item, index)
      return
    }

    this.stageBlocks.forEach((block, blockIndex) => {
      const rootIndex = this.placedBlocks.findIndex(
        (rootBlock) => rootBlock.item.id === block.item.id,
      )
      const sum = this.stageBlocks.reduce(
        (accumulator, element) => accumulator + element.item.gasCost,
        0,
      )
      if (isVertical) {
        const innerHeight =
          (this.height - this.currentHeight) *
          (block.item.gasCost / (sum + blockData.item.gasCost))
        const y =
          blockIndex === 0
            ? this.currentHeight - this.margin
            : this.placedBlocks[blockIndex - 1].dimensions.y +
              this.placedBlocks[blockIndex - 1].dimensions.height -
              this.margin
        this.placedBlocks[rootIndex] = {
          ...block,
          dimensions: {
            ...block.dimensions,
            y,
            width: blockData.dimensions.width - this.margin,
            height: innerHeight,
          },
        }
      }
      if (!isVertical) {
        const innerWidth =
          (this.width - this.currentWidth) *
          (block.item.gasCost / (sum + blockData.item.gasCost))
        const x =
          blockIndex === 0
            ? this.currentWidth - this.margin
            : this.placedBlocks[blockIndex - 1].dimensions.x +
              this.placedBlocks[blockIndex - 1].dimensions.width -
              this.margin
        this.placedBlocks[rootIndex] = {
          ...block,
          dimensions: {
            ...block.dimensions,
            x,
            width: innerWidth,
            height: blockData.dimensions.height - this.margin,
          },
        }
      }
    })

    if (isVertical) {
      if (this.placedBlocks.at(-1)!.dimensions.x === blockData.dimensions.x) {
        blockData.dimensions.y =
          this.placedBlocks.at(-1)!.dimensions.y +
          this.placedBlocks.at(-1)!.dimensions.height +
          this.margin
        blockData.dimensions.height =
          this.height - blockData.dimensions.y - this.margin
      }
      this.stageValue = blockData.dimensions.width + this.margin
    }
    if (!isVertical) {
      if (this.placedBlocks.at(-1)!.dimensions.y === blockData.dimensions.y) {
        blockData.dimensions.x =
          this.placedBlocks.at(-1)!.dimensions.x +
          this.placedBlocks.at(-1)!.dimensions.width +
          this.margin
        blockData.dimensions.width =
          this.width - blockData.dimensions.x - this.margin
      }
      this.stageValue = blockData.dimensions.height + this.margin
    }
    this.placedBlocks.push(blockData)
    this.stageBlocks.push(blockData)
    this.lastAspectRatio = currentAspect
  }

  public mapItems() {
    this.sortDescendingByGas()
    this.items.forEach((item, index) => {
      this.placeBlock(item, index)
    })

    return this.placedBlocks
  }
}
