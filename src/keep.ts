import defu from 'defu'

import type { Promisable } from 'type-fest'
import type { GetNativeSelectionResult, GetSelectionResult } from './get'
import { getNativeSelection, getSelection } from './get'
import { setSelection, setSelectionNode } from './set'
import { checkIfElementIsInBound, isInputOrTextarea } from './utils'
import { getProp, removeProp, setProp } from './define'
import type { Arrayable } from '.'

export interface KeepSelectionOptions {
  keepInBound: Arrayable<HTMLElement> | (() => Arrayable<HTMLElement>)
  boundBorder?: number
  getCurrentElement?: (() => HTMLElement | null | undefined)
  beforeBlur?: (() => Promisable<boolean>)
  onBlur?: ((e: FocusEvent) => void)
}

/**
 * Keep the selection event when the element lose focused
 *
 */
export function keepSelection(element: HTMLElement, options?: KeepSelectionOptions) {
  const _options = defu(options, {
    boundBorder: 0,
  })

  // /fix the function handleBlur is called when the blur event happens, but the console.log('hello') is unreachable in the 2nd blur when the previous _options.beforeBlur() hasn't been resolved, i have added hasUnresolvedPromise to skip executing _options.beforeBlur() in the 2nd time but it doesn't work
  function reselectElement(currentSelection: GetSelectionResult | GetNativeSelectionResult) {
    const scrollTop = element.scrollTop
    const scrollLeft = element.scrollLeft

    if (isInputOrTextarea(element)) {
      const selection = currentSelection as GetSelectionResult

      setSelection(element, {
        start: selection.start,
        end: selection.end,
        direction: selection.direction || 'forward',
      })
    }
    else {
      // contenteditable contains HTML tags, so it would be more complicated
      // there are cases where the selection is between 2 different nodes
      // therefore getting the native selection is necessary to have the
      // correct start and end nodes
      // For example:
      // Text: "<b>Hello</b> World"
      // If you select Hello World, you probably select the text node inside the <b> tag ("Hello")
      // and the text node outside the <b> tag (" World")
      // you must set the range position to the correct node in order for it to work correctly
      setSelectionNode(element, {
        nativeSelection: currentSelection as GetNativeSelectionResult,
      })
    }

    element.scrollTop = scrollTop
    element.scrollLeft = scrollLeft
  }

  async function handleBlur(e: FocusEvent) {
    const disabled = getProp(element, 'disabled')

    if (e.relatedTarget instanceof HTMLElement && e.relatedTarget.classList.contains('ql-clipboard'))
      return

    if (e.target !== options?.getCurrentElement?.())
      return

    if (disabled === 'true')
      return _options.onBlur?.(e)

    const currentSelection = getSelection(element)
    const currentNativeSelection = getNativeSelection()

    if (!currentSelection.text)
      return _options.onBlur?.(e)

    const isMouseInBound = e.relatedTarget
      ? checkIfElementIsInBound(e.relatedTarget as HTMLElement, _options.keepInBound)
      : false

    const selection = isInputOrTextarea(element) ? currentSelection : currentNativeSelection

    if (isMouseInBound) {
      reselectElement(selection)
    }
    else if (_options.beforeBlur && typeof _options.beforeBlur === 'function') {
      const blurPending = getProp(element, 'pending')

      if (blurPending) {
        reselectElement(selection)
      }
      else {
        setProp(element, 'pending', 'true')

        const doBlur = await _options.beforeBlur()

        removeProp(element, 'pending')

        if (doBlur)
          _options.onBlur?.(e)
        else
          reselectElement(selection)
      }
    }
    else {
      _options.onBlur?.(e)
    }
  }

  const keepEnable = getProp(element, 'keep')

  if (!keepEnable) {
    setProp(element, 'keep', '1')

    element.addEventListener('blur', handleBlur)
  }

  function removeKeepListener() {
    element.removeEventListener('blur', handleBlur)
  }

  return {
    stop: removeKeepListener,
  }
}
