import defu from 'defu'

interface DefineSelectableOptions {
  keep?: boolean
}

let i: number = 0

export function defineSelectable<T extends HTMLElement>(element: T, options?: DefineSelectableOptions) {
  const _options = defu(options, {
    keep: false
  })
  
  const selectableId = getProp(element, 'id')

  if (!selectableId) {
    setProp(element, 'id', String(i))
    setProp(element, 'keep', String(_options.keep))
  
    i++
  }
  
  return element
}


export function getProp<T extends HTMLElement>(element: T, key: 'id' | 'keep') {
  return element.dataset['selectable-' + key]
}

export function setProp<T extends HTMLElement>(element: T, key: 'id' | 'keep', value: string) {
  element.setAttribute('data-selectable-' + key, value)
  
  return element
}
