import defu from 'defu'
import type { Arrayable } from '.'

let mouseX = 0
let mouseY = 0

let watcherStarted = false

function onMousemove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

export function watchMouseMovement() {
  if (!watcherStarted) {
    document.addEventListener('mousemove', onMousemove)

    watcherStarted = true
  }

  return {
    stop: () => {
      document.removeEventListener('mousemove', onMousemove)
    },
  }
}

export function getMousePos() {
  return {
    x: mouseX,
    y: mouseY,
  }
}

export interface IsMouseInBoundOptions {
  border?: number
}

export function isMouseInElement(element: HTMLElement, options?: IsMouseInBoundOptions) {
  const _options = defu(options, {
    border: 0,
  })

  const rect = element.getBoundingClientRect()

  return (
    mouseX >= (rect.left - _options.border)
    && mouseX <= (rect.right + _options.border)
    && mouseY >= (rect.top - _options.border)
    && mouseY <= (rect.bottom + _options.border)
  )
}

export function checkIfMouseIsInBound(bounds: Arrayable<HTMLElement> | (() => Arrayable<HTMLElement>), border?: number) {
  if (typeof bounds === 'function') {
    const _bounds = bounds()

    return Array.isArray(_bounds)
      ? _bounds.some(e => isMouseInElement(e, { border }))
      : isMouseInElement(_bounds, { border })
  }
  else {
    return Array.isArray(bounds)
      ? bounds.some(e => isMouseInElement(e, { border }))
      : isMouseInElement(bounds, { border })
  }
}
