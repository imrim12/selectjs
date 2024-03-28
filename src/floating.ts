import type { VirtualElement } from '@floating-ui/dom'
import { autoUpdate, computePosition, flip, inline, offset, shift } from '@floating-ui/dom'

export function attachFloating(virtualElement: VirtualElement, tooltipElement: HTMLElement) {
  const cleanup = autoUpdate(virtualElement, tooltipElement, async () => {
    const { x, y, strategy } = await computePosition(virtualElement, tooltipElement, {
      placement: 'right-end',
      strategy: 'fixed',
      middleware: [
        inline(),
        flip(),
        shift(),
        offset(),
      ],
    })

    tooltipElement.style.position = strategy
    tooltipElement.style.left = `${x}px`
    tooltipElement.style.top = `${y}px`
  })

  return cleanup
}
