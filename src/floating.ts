import defu from 'defu'
import type { FlipOptions, HideOptions, InlineOptions, OffsetOptions, Placement, ShiftOptions, Strategy, VirtualElement } from '@floating-ui/dom'
import { computePosition, flip, inline, offset, shift } from '@floating-ui/dom'

export interface FloatingOptions {
  placement?: Placement
  strategy?: Strategy
  inline?: InlineOptions
  flip?: FlipOptions
  shift?: ShiftOptions
  offset?: OffsetOptions
  hide?: HideOptions
  onCalculateZIndex?: (zIndex: number) => void
}

function calculateZIndex(el: VirtualElement) {
  const boundingRect = el.getBoundingClientRect()

  const zIndexes = document.elementsFromPoint(boundingRect.x, boundingRect.y).map((e) => {
    const zIndex = Number(window.getComputedStyle(e).zIndex)

    return Number.isNaN(zIndex) ? 0 : zIndex
  })

  const maxIndex = zIndexes.length ? Math.max(...zIndexes) : 0

  return maxIndex + 1
}

export async function attachFloating(virtualElement: VirtualElement, tooltipElement: HTMLElement, options?: FloatingOptions) {
  const _options = defu(options, {
    offset: {
      mainAxis: 4,
    },
  })

  const zIndex = calculateZIndex(virtualElement)

  const { x, y, strategy } = await computePosition(virtualElement, tooltipElement, {
    placement: _options.placement || 'right-end',
    strategy: _options.strategy || 'fixed',
    middleware: [
      inline(_options.inline),
      flip(_options.flip),
      shift(_options.shift),
      offset(_options.offset),
    ],
  })

  tooltipElement.style.zIndex = String(zIndex)

  options?.onCalculateZIndex?.(zIndex)

  tooltipElement.style.position = strategy
  tooltipElement.style.left = `${x}px`
  tooltipElement.style.top = `${y}px`
}

export function isElementOverflowFromTargetViewport(element: HTMLElement, target: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  return (
    rect.top < targetRect.top
    || rect.bottom > targetRect.bottom
    || rect.left < targetRect.left
    || rect.right > targetRect.right
  )
}
