import defu from 'defu'
import type { FlipOptions, InlineOptions, OffsetOptions, Placement, ShiftOptions, Strategy, VirtualElement } from '@floating-ui/dom'
import { autoUpdate, computePosition, flip, inline, offset, shift } from '@floating-ui/dom'

export interface FloatingOptions {
  placement?: Placement
  strategy?: Strategy
  inline?: InlineOptions
  flip?: FlipOptions
  shift?: ShiftOptions
  offset?: OffsetOptions
}

export function attachFloating(virtualElement: VirtualElement, tooltipElement: HTMLElement, options: FloatingOptions) {
  const _options = defu(options, {
    offset: {
      mainAxis: 4,
    },
  })

  const cleanup = autoUpdate(virtualElement, tooltipElement, async () => {
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

    tooltipElement.style.position = strategy
    tooltipElement.style.left = `${x}px`
    tooltipElement.style.top = `${y}px`
  })

  return cleanup
}
