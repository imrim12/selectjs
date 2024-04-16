import defu from 'defu'
import { defineSelectable } from './define'
import { getSelection, getSelectionRect } from './get'
import type { GetSelectionRectResult, GetSelectionResult } from './get'
import { keepSelection } from './keep'
import { debounce, isInputOrTextarea } from './utils'
import { enableEffect, isEffectDisabled } from './effect'
import { checkIfMouseIsInBound, isMouseInElement, watchMouseMovement } from './mouse'
import type { Arrayable } from '.'

export interface WatchSelectionOptions {
  keepInBound?: Arrayable<HTMLElement> | (() => Arrayable<HTMLElement>)
  boundBorder?: number
  debounce?: number
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

  const _element = defineSelectable(element)

  watchMouseMovement()

  let lastSelectedText = ''
  function handleSelectionChange() {
    const nativeSelection = window.getSelection()
    const range = nativeSelection?.getRangeAt(0)

    // Prevent event running if the selection is not in the current element (selectionchange is listened on all document!)
    if (!isInputOrTextarea(_element) && !_element.contains(range!.commonAncestorContainer))
      return

    if (
      _options.keepInBound
      && !isMouseInElement(element, { border: _options.boundBorder })
      && !checkIfMouseIsInBound(_options.keepInBound, _options.boundBorder)
      && !_options.debounce
    )
      return

    if (isEffectDisabled()) {
      enableEffect()

      return
    }

    const selection = getSelection(_element)

    if (selection.text === lastSelectedText)
      return

    lastSelectedText = selection.text

    const selectionRect = getSelectionRect(_element)

    callback(selection, selectionRect)
  }
  const debouncedHandleSelectionChange = _options.debounce ? debounce(handleSelectionChange, _options.debounce) : handleSelectionChange

  document.addEventListener('selectionchange', debouncedHandleSelectionChange)

  let stopKeeping: null | (() => void) = null
  if (_options.keepInBound) {
    stopKeeping = keepSelection(_element, {
      keepInBound: _options.keepInBound,
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
