import type { Rect } from '.'

export function isInput(element: HTMLElement) {
  return element.tagName === 'INPUT'
}

export function isTextarea(element: HTMLElement) {
  return element.tagName === 'TEXTAREA'
}

export function isContentEditable(element: HTMLElement) {
  return element.contentEditable === 'true' || element.contentEditable === ''
}

export function isInputOrTextarea(element: HTMLElement) {
  return isInput(element) || isTextarea(element)
}

export function shadowElement(el: HTMLElement, style: Partial<CSSStyleDeclaration> = {}) {
  const elRect = el.getBoundingClientRect()

  const newEl = document.createElement('div')

  if (isInputOrTextarea(el))
    newEl.innerHTML = (el as HTMLInputElement | HTMLTextAreaElement).value
  else
    newEl.innerHTML = el.innerHTML

  const elComputedStyles = window.getComputedStyle(el)

  for (const style of [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'fontFamily',
    'fontSize',
    'lineHeight',
    'textAlign',
  ]) {
    Object.assign(newEl.style, {
      [style]: elComputedStyles[style as keyof typeof elComputedStyles],
    })
  }

  newEl.style.boxSizing = 'border-box'
  newEl.style.visibility = 'hidden'
  // newEl.style.backgroundColor = 'transparent'
  // newEl.style.color = 'transparent'
  // newEl.style.opacity = '0'

  newEl.style.position = 'fixed'
  newEl.style.top = `${elRect.top}px`
  newEl.style.left = `${elRect.left}px`
  newEl.style.width = `${elRect.width}px`
  newEl.style.height = `${elRect.height}px`
  newEl.style.zIndex = '100000'
  newEl.style.pointerEvents = 'none'

  Object.assign(newEl.style, style)

  return newEl
}

export function debounce(fn: Function, time = 0) {
  let timeout: number

  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout)
      fn(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, time)
  }
}

export function createRelativeRect(rect: Rect, x: number, y: number) {
  return {
    top: rect.top - y,
    right: rect.right - x,
    bottom: rect.bottom - y,
    left: rect.left - x,
    width: rect.width,
    height: rect.height,
    x: rect.x - x,
    y: rect.y - y,
  }
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function clampRect(rect: Rect, bound: Rect) {
  if (!rect || !bound)
    return new DOMRect() as Rect

  const result = {
    x: clamp(rect.x, bound.left, bound.right),
    y: clamp(rect.y, bound.top, bound.bottom),
    top: clamp(rect.top, bound.top, bound.bottom),
    left: clamp(rect.left, bound.left, bound.right),
    right: clamp(rect.right, bound.left, bound.right),
    bottom: clamp(rect.bottom, bound.top, bound.bottom),
    width: clamp(rect.width, 0, bound.width),
    height: clamp(rect.height, 0, bound.height),
  }

  return result
}
