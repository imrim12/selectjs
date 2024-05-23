import type { Arrayable, Rect } from '.'

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

export function shadowInput(el: HTMLInputElement | HTMLTextAreaElement, style: Partial<CSSStyleDeclaration> = {}) {
  const elRect = el.getBoundingClientRect()

  const newEl = document.createElement('div')

  const start = el.selectionStart || 0
  const end = el.selectionEnd || 0

  newEl.appendChild(document.createTextNode(el.value.slice(0, start)))
  const highlightEl = document.createElement('span')
  highlightEl.innerHTML = el.value.slice(start, end)

  newEl.appendChild(highlightEl)

  const elComputedStyles = window.getComputedStyle(el)

  for (const style of [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingBlock',
    'paddingInline',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'borderWidth',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderImageWidth',
    'fontFamily',
    'fontSize',
    'lineHeight',
    'textAlign',
  ]) {
    Object.assign(newEl.style, {
      [style]: elComputedStyles[style as keyof typeof elComputedStyles],
    })
  }

  const actualInnerHeight = elRect.height - (Number.parseFloat(elComputedStyles.borderTop) + Number.parseFloat(elComputedStyles.borderBottom))

  newEl.style.boxSizing = 'border-box'
  newEl.style.visibility = 'hidden'
  newEl.style.position = 'fixed'
  newEl.style.top = `${elRect.top}px`
  newEl.style.left = `${elRect.left}px`
  newEl.style.width = `${el.clientWidth}px`
  newEl.style.height = `${el.clientHeight}px`
  newEl.style.zIndex = '100000'
  newEl.style.pointerEvents = 'none'
  newEl.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
  newEl.style.color = 'white'

  if (isTextarea(el)) {
    newEl.style.whiteSpace = 'pre-wrap'
  }
  else if (isInput(el)) {
    newEl.style.whiteSpace = 'nowrap'
    newEl.style.lineHeight = `${actualInnerHeight}px`
  }

  Object.assign(newEl.style, style)

  return {
    shadowEl: newEl,
    highlightEl,
  }
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

export function checkIfElementIsInBound(target: HTMLElement, bounds: Arrayable<HTMLElement> | (() => Arrayable<HTMLElement>)) {
  if (typeof bounds === 'function') {
    const _bounds = bounds()

    return Array.isArray(_bounds)
      ? _bounds.includes(target)
      : _bounds === target
  }
  else {
    return Array.isArray(bounds)
      ? bounds.includes(target)
      : bounds === target
  }
}
