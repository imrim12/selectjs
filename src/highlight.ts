import defu from 'defu'

import { Rect } from './get';
import { getProp } from './define';

export interface SetHighlightOptions {
  class?: string
  height?: number
  color?: string
  container?: HTMLElement
  position?: 'fixed' | 'absolute',
  offsetX?: number
  offsetY?: number
  duration?: number
}

/**
 * Create highlighting blocks by the passed `rects`
 * 
 * If `options.class` has value, all styling property will not be added~
 */
export function setHighlight(element: HTMLElement, rects: Rect[], options?: SetHighlightOptions) {
  const _options = defu(options, {
    height: 2,
    color: '#3fba54',
    container: element.parentElement || document,
    position: 'absolute' as const,
    offsetX: 0,
    offsetY: 0,
    duration: 300,
  })
  const selectableId = getProp(element, 'id')
  
  if (!selectableId) return

  const existingHighlight = document.querySelectorAll(`[data-selectable-highlight-for="${selectableId}"]`)
  existingHighlight.forEach((e) => e.remove())

  const highlights: HTMLDivElement[] = []
  
  const scrollY = window.scrollY
  const scrollX = window.scrollX

  let i = 0
  for (const rect of rects) {
    const div = document.createElement('div')

    div.setAttribute('data-selectable-highlight-for', selectableId)
    div.setAttribute('data-selectable-highlight-id', i.toString())

    div.style.top = `${rect.top + rect.height + _options.offsetY + scrollY}px`
    div.style.left = `${rect.left + _options.offsetX + scrollX}px`
    div.style.width = `${rect.width}px`
    
    if (_options.class) {
      div.classList.add(_options.class)
    } else {
      div.style.height = `${_options.height}px`
      div.style.backgroundColor = `${_options.color}`
      div.style.position = _options.position
      div.style.userSelect = 'none'
      div.style.transitionDuration = `${_options.duration}ms`
    }

    _options.container.appendChild(div)
    highlights.push(div)
    i++
  }

  function clear() {
    for (const highlight of highlights)
      _options.container.removeChild(highlight)
  }

  return {
    clear
  }
}
