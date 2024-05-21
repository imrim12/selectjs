import defu from 'defu'

type DefineKeys = 'id' | 'watch' | 'keep' | 'pending' | 'disabled'

interface DefineSelectableOptions {
  disabled?: boolean
}

let i: number = 0

export function defineSelectable<T extends HTMLElement>(element: T, options?: DefineSelectableOptions) {
  const _options = defu(options, {})

  element.normalize()

  const selectableId = getProp(element, 'id')

  if (!selectableId) {
    setProp(element, 'id', String(i))

    i++
  }

  if (_options.disabled)
    setProp(element, 'disabled', 'true')

  return element
}

export function getProp<T extends HTMLElement>(element: T, key: DefineKeys) {
  const prop = element.getAttribute(`data-g-${key}`)

  return prop
}

export function setProp<T extends HTMLElement>(element: T, key: DefineKeys, value: string) {
  element.setAttribute(`data-g-${key}`, value)

  return element
}

export function removeProp<T extends HTMLElement>(element: T, key: DefineKeys) {
  return element.removeAttribute(`data-g-${key}`)
}
