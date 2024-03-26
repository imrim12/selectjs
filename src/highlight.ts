import defu from 'defu'

import { Rect } from './get';

export interface SetHighlightOptions {
  class?: string
  height?: number
  color?: string
  container?: HTMLElement
  position?: 'fixed' | 'absolute',
  duration?: number
}

/**
 * Create highlighting blocks by the passed `rects`
 * 
 * If `options.class` has value, all styling property will not be added~
 */
export function setHighlight(rects: Rect[], options?: SetHighlightOptions) {
  const _options = defu(options, {
    height: 2,
    color: '#3fba54',
    container: document.body,
    position: 'absolute' as const,
    duration: 300
  })

  const highlights: HTMLDivElement[] = []

  for (const rect of rects) {
    const div = document.createElement('div')
  
    div.style.top = `${rect.top + rect.height}px`
    div.style.left = `${rect.left}px`
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
  }

  function clear() {
    for (const highlight of highlights)
      _options.container.removeChild(highlight)
  }

  return {
    clear
  }
}
