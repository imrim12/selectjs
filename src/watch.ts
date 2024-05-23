import defu from 'defu'
import type { Promisable } from 'type-fest'
import { defineSelectable, getProp, setProp } from './define'
import { getSelection, getSelectionRect } from './get'
import type { GetSelectionRectResult, GetSelectionResult } from './get'
import { keepSelection } from './keep'
import { debounce, isInputOrTextarea } from './utils'
import type { Arrayable } from '.'

export interface WatchSelectionOptions {
  keepInBound?: Arrayable<HTMLElement> | (() => Arrayable<HTMLElement>)
  boundBorder?: number
  debounce?: number
  getCurrentElement?: (() => HTMLElement | null | undefined)
  beforeBlur?: (() => Promisable<boolean>)
  onBlur?: (e: FocusEvent) => void
}

export function watchSelection(
  element: HTMLElement,
  callback: (selection: GetSelectionResult, selectionRect: GetSelectionRectResult) => void,
  options?: WatchSelectionOptions,
) {
  const _options = defu(options, {
    debounce: 0,
    boundBorder: 0,
  })

  let _element = element

  let lastSelectedText = ''

  function handleSelectionChange() {
    const disabled = getProp(element, 'disabled')
    if (disabled === 'true')
      return

    const nativeSelection = window.getSelection()

    if (!nativeSelection || !nativeSelection?.rangeCount)
      return

    const range = nativeSelection.getRangeAt(0)

    // Prevent event running if the selection is not in the current element (selectionchange is listened on all document!)
    if (!isInputOrTextarea(_element) && !_element.contains(range!.commonAncestorContainer))
      return

    const selection = getSelection(_element)

    if (selection.text === lastSelectedText)
      return

    lastSelectedText = selection.text

    const selectionRect = getSelectionRect(_element)

    callback(selection, selectionRect)
  }
  const debouncedHandleSelectionChange = _options.debounce ? debounce(handleSelectionChange, _options.debounce) : handleSelectionChange

  if (!getProp(element, 'watch')) {
    _element = defineSelectable(element)

    setProp(_element, 'watch', 'true')

    document.addEventListener('selectionchange', debouncedHandleSelectionChange)
  }

  let stopKeeping: null | (() => void) = null
  if (_options.keepInBound) {
    stopKeeping = keepSelection(_element, {
      getCurrentElement: _options.getCurrentElement,
      keepInBound: _options.keepInBound,
      beforeBlur: _options.beforeBlur,
      onBlur: _options.onBlur,
    }).stop
  }
  else if (_options.onBlur) {
    _element.addEventListener('blur', _options.onBlur)
  }

  return {
    stopKeeping,
  }
}
