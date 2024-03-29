import defu from 'defu'
import { defineSelectable } from './define'
import { getSelection, getSelectionRect } from './get'
import type { GetSelectionRectResult, GetSelectionResult } from './get'
import { keepSelection } from './keep'
import { debounce } from './utils'
import { enableEffect, isEffectDisabled } from './effect'

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

  let isMouseOrTouchDownOnElement = false
  function handleMouseOrTouchDownOnElement() {
    isMouseOrTouchDownOnElement = true
  }

  function handleMouseOrTouchUpOnElement() {
    isMouseOrTouchDownOnElement = false
  }

  let lastSelectedText = ''
  function handleSelectionChange() {
    // `isMouseOrTouchDownOnElement` will be false if debounce has value because by that time, no mouse event is captured!
    if (!isMouseOrTouchDownOnElement && !_options.debounce)
      return

    if (isEffectDisabled()) {
      enableEffect()

      return
    }

    const selection = getSelection(element)

    if (!selection.text)
      return

    if (selection.text === lastSelectedText)
      return

    lastSelectedText = selection.text

    const selectionRect = getSelectionRect(element)

    callback(selection, selectionRect)
  }
  const debouncedHandleSelectionChange = _options.debounce ? debounce(handleSelectionChange, _options.debounce) : handleSelectionChange

  _element.addEventListener('mousedown', handleMouseOrTouchDownOnElement)
  _element.addEventListener('mouseup', handleMouseOrTouchUpOnElement)
  _element.addEventListener('touchstart', handleMouseOrTouchDownOnElement)
  _element.addEventListener('touchend', handleMouseOrTouchUpOnElement)

  document.addEventListener('selectionchange', debouncedHandleSelectionChange)

  let stopKeeping: null | (() => void) = null
  if (_options.keepInBound) {
    stopKeeping = keepSelection(element, {
      withinBound: _options.keepInBound,
      onBlur: _options.onBlur,
    }).stop
  }
  else if (_options.onBlur) {
    element.addEventListener('blur', _options.onBlur)
  }

  return {
    stopKeeping,
  }
}
