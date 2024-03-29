import defu from 'defu'

interface DefineSelectableOptions {}

let i: number = 0

export function defineSelectable<T extends HTMLElement>(element: T, options?: DefineSelectableOptions) {
  const _options = defu(options, {})

  element.normalize()

  const selectableId = getProp(element, 'id')

  if (!selectableId) {
    setProp(element, 'id', String(i))

    i++
  }

  return element
}

export function getProp<T extends HTMLElement>(element: T, key: 'id') {
  return element.getAttribute(`data-selectable-${key}`)
}

export function setProp<T extends HTMLElement>(element: T, key: 'id', value: string) {
  element.setAttribute(`data-selectable-${key}`, value)

  return element
}
