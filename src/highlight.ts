import defu from 'defu'

import type { Rect } from './get'
import { getProp } from './define'

export interface SetHighlightOptions {
  class?: string
  stroke?: number | 'full'
  color?: string
  blendMode?: string
  container?: HTMLElement
  position?: 'fixed' | 'absolute'
  offsetX?: number
  offsetY?: number
  duration?: number
  interactive?: boolean
}

/**
 * Create highlighting blocks by the passed `rects`
 *
 * If `options.class` has value, all styling property will not be added~
 */
export function setHighlight(element: HTMLElement, rects: Rect[], options?: SetHighlightOptions) {
  const _options = defu(options, {
    stroke: 2,
    color: '#25C9D0',
    blendMode: 'normal',
    container: element.parentElement || document,
    position: 'absolute' as const,
    offsetX: 0,
    offsetY: 0,
    duration: 300,
    interactive: false,
  })
  const disabled = getProp(element, 'disabled')

  if (disabled === 'true')
    return

  const selectableId = getProp(element, 'id')

  if (!selectableId)
    return

  const existingHighlight = document.querySelectorAll(`[data-g-h-for="${selectableId}"]`)
  existingHighlight.forEach(e => e.remove())

  const highlights: HTMLDivElement[] = []

  const scrollY = window.scrollY
  const scrollX = window.scrollX

  let i = 0
  for (const rect of rects) {
    const div = document.createElement('div')

    div.setAttribute('data-g-h-for', selectableId)
    div.setAttribute('data-g-h-id', i.toString())

    div.style.top = `${rect.top + (_options.stroke === 'full' ? 0 : rect.height) + _options.offsetY + scrollY}px`
    div.style.left = `${rect.left + _options.offsetX + scrollX}px`
    div.style.width = `${rect.width}px`

    if (_options.class) {
      div.classList.add(_options.class)
    }
    else {
      div.style.height = _options.stroke === 'full' ? `${rect.height}px` : `${_options.stroke}px`
      div.style.backgroundColor = `${_options.color}`
      div.style.position = _options.position
      div.style.userSelect = 'none'
      div.style.mixBlendMode = _options.blendMode
      div.style.transitionDuration = `${_options.duration}ms`
      div.style.transitionProperty = 'opacity'
      div.style.opacity = '1'
    }

    if (!_options.interactive)
      div.style.pointerEvents = 'none'

    _options.container.appendChild(div)
    highlights.push(div)
    i++
  }

  function clear() {
    for (const highlight of highlights) {
      highlight.style.opacity = '0'

      requestAnimationFrame(() => {
        _options.container.removeChild(highlight)
      })
    }
  }

  return {
    clear,
  }
}
