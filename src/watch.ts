import defu from 'defu'
import { defineSelectable } from './define'
import { getSelection, getSelectionRect } from './get'
import type { GetSelectionRectResult, GetSelectionResult } from './get'
import { keepSelection } from './keep'
import { debounce } from './utils'
import { enableEffect, isEffectDisabled } from './effect'
import { isMouseInBound, watchMouseMovement } from './mouse'

export interface WatchSelectionOptions {
  keepInBound?: HTMLElement | HTMLElement[]
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
  })

  const _element = defineSelectable(element, _options)

  watchMouseMovement()

  let lastSelectedText = ''
  function handleSelectionChange() {
    if (
      _options.keepInBound
      && !isMouseInBound(element)
      && !(
        Array.isArray(_options.keepInBound)
          ? _options.keepInBound.some(isMouseInBound)
          : _options.keepInBound && isMouseInBound(_options.keepInBound)
      )
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
      withinBound: _options.keepInBound,
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
