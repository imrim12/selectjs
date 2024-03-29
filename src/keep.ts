import defu from 'defu'

import { getSelection } from './get'
import { setSelection, setSelectionNode } from './set'
import { isInputOrTextarea } from './utils'
import { isMouseInBound, watchMouseMovement } from './mouse'

export interface KeepSelectionOptions {
  withinBound?: HTMLElement | HTMLElement[]
  onBlur?: ((e: FocusEvent) => void)
}

/**
 * Keep the selection event when the element lose focused
 *
 */
export function keepSelection(element: HTMLElement, options?: KeepSelectionOptions) {
  const _options = defu(options, {})

  watchMouseMovement()

  function reselectElement(e: FocusEvent) {
    const currentSelection = getSelection(element)

    if (
      !currentSelection.text
      || (
        _options.withinBound
        && !isMouseInBound(element)
        && !(
          Array.isArray(_options.withinBound)
            ? _options.withinBound.some(isMouseInBound)
            : isMouseInBound(_options.withinBound)
        )
      )
    ) {
      _options.onBlur?.(e)

      return
    }

    if (isInputOrTextarea(element)) {
      setSelection(element, {
        start: currentSelection.start,
        end: currentSelection.end,
        noEffect: true,
      })
    }
    else {
      setSelectionNode(window.getSelection()?.focusNode || element, {
        start: currentSelection.start,
        end: currentSelection.end,
        noEffect: true,
      })
    }
  }

  element.addEventListener('blur', reselectElement)

  function removeKeepListener() {
    element.removeEventListener('blur', reselectElement)
  }

  return {
    stop: removeKeepListener,
  }
}
