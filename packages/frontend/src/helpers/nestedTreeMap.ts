// TODO: refactor so congitive-complexity is less than 15
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { TIntrinsicLog, TMainTraceLogsWithId, TNestedTreeMapItem } from '../types'

import { sumReducer } from './helpers'

export class NestedMap {
  constructor(private width: number, private height: number, private items: (TMainTraceLogsWithId | TIntrinsicLog)[]) {
    this.items = [...items]
  }

  private margin = 12

  private currentWidth = this.margin * 2
  private currentHeight = this.margin * 2

  private stageValue = 0
  private stageBlocks: TNestedTreeMapItem[] = []

  private placedBlocks: TNestedTreeMapItem[] = []

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

  private placeBlock(item: TMainTraceLogsWithId | TIntrinsicLog, index: number) {
    const isVertical = this.width - this.currentWidth > this.height - this.currentHeight

    const mapArea = (this.height - this.currentHeight) * (this.width - this.currentWidth)

    const itemArea =
      mapArea *
      (item.gasCost /
        this.items
          .slice(index)
          .map((block) => block.gasCost)
          .reduce(sumReducer, 0))

    const blockData = {
      ...item,
      y: this.currentHeight - this.margin,
      x: this.currentWidth - this.margin,
    } as TNestedTreeMapItem

    const gasPercentage =
      item.gasCost / (this.stageBlocks.reduce((accumulator, element) => accumulator + element.traceLog.gasCost, 0) + item.gasCost)

    let width: number, height: number
    if (isVertical) {
      height = (this.height - this.currentHeight) * gasPercentage
      width = itemArea / height
    } else {
      width = (this.width - this.currentWidth) * gasPercentage
      height = itemArea / width
    }

    if (this.stageBlocks.length === 0) {
      this.placedBlocks.push(blockData)
      this.stageBlocks.push(blockData)
      this.lastAspectRatio = this.calculateAspectRatio(blockData.width, blockData.height)
      if (isVertical) this.stageValue += blockData.width + this.margin

      if (!isVertical) this.stageValue += blockData.height + this.margin

      return
    }

    const currentAspect = this.calculateAspectRatio(blockData.width, blockData.height)
    if (this.isWorseRatio(currentAspect)) {
      if (isVertical) {
        this.placedBlocks.at(-1).width -= this.margin / 2
        this.currentWidth += this.stageValue - this.margin
      }
      if (!isVertical) {
        this.placedBlocks.at(-1).height -= this.margin / 2
        this.currentHeight += this.stageValue - this.margin
      }

      this.lastAspectRatio = currentAspect
      this.stageValue = 0
      this.stageBlocks = []
      this.placeBlock(item, index)
      return
    }

    this.stageBlocks.forEach((block, blockIndex) => {
      const rootIndex = this.placedBlocks.findIndex((rootBlock) => rootBlock.id === block.id)
      const sum = this.stageBlocks.reduce((accumulator, element) => accumulator + element.gasCost, 0)
      if (isVertical) {
        const innerHeight = (this.height - this.currentHeight) * (block.gasCost / (sum + blockData.gasCost))

        const y =
          blockIndex === 0
            ? this.currentHeight - this.margin
            : this.placedBlocks[blockIndex - 1].y + this.placedBlocks[blockIndex - 1].height - this.margin
        this.placedBlocks[rootIndex] = {
          ...block,
          y,
          width: blockData.width - this.margin / 2,
          height,
        }
      }
      if (!isVertical) {
        const innerWidth = (this.width - this.currentWidth) * (block.gasCost / (sum + blockData.gasCost))
        const x =
          blockIndex === 0
            ? this.currentWidth - this.margin
            : this.placedBlocks[blockIndex - 1].x + this.placedBlocks[blockIndex - 1].width - this.margin
        this.placedBlocks[rootIndex] = {
          ...block,
          x,
          width,
          height: blockData.height - this.margin / 2,
        }
      }
    })

    if (isVertical) {
      if (this.placedBlocks.at(-1)!.x === blockData.x) {
        blockData['y'] = this.placedBlocks.at(-1)!.y + this.placedBlocks.at(-1)!.height + this.margin
        blockData['height'] = this.height - blockData.y - this.margin
      }
      this.stageValue = blockData.width + this.margin
    }
    if (!isVertical) {
      if (this.placedBlocks.at(-1)!.y === blockData.y) {
        blockData['x'] = this.placedBlocks.at(-1)!.x + this.placedBlocks.at(-1)!.width + this.margin
        blockData['width'] = this.width - blockData.x - this.margin
      }
      this.stageValue = blockData.height + this.margin
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
