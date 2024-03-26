import defu from 'defu'

import { getSelection } from './get';
import { setSelection } from './set';

export interface KeepSelectionOptions {
  stopIfSelectEmpty: boolean
}

/**
 * Keep the selection event when the element lose focused
 *
 */
export function keepSelection(element: HTMLElement, options?: KeepSelectionOptions) {
  const _options = defu(options, {
    stopIfSelectEmpty: true
  })

  const selection = getSelection(element)
  
  function reselectElement() {
    const currentSelection = getSelection(element)

    if (!currentSelection.text && _options.stopIfSelectEmpty)
      return removeKeepListener()

    setSelection(element, { start: currentSelection.start || selection.start, end: currentSelection.end || selection.end })
  }

  element.addEventListener('blur', reselectElement)

  function removeKeepListener() {
    element.removeEventListener('blur', reselectElement)
  }
  
  return {
    stop: removeKeepListener
  }
}