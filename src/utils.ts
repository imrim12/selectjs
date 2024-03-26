export function isInputOrTextarea(element: HTMLElement) {
  return (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')
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
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'fontFamily', 'fontSize',
    'lineHeight',
    'textAlign'
  ]) {
    Object.assign(newEl.style, {
      [style]: elComputedStyles[style as keyof typeof elComputedStyles]
    })
  }

  newEl.style.boxSizing = 'border-box'
  newEl.style.backgroundColor = 'transparent'
  newEl.style.color = 'transparent'
  newEl.style.opacity = '0'

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
