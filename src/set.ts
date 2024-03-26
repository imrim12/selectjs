import defu from 'defu'

import { isInputOrTextarea } from './utils'
import { keepSelection } from './keep'

export interface SetSelectionOptions {
  start: number,
  end: number,
  keep?: boolean
}

export interface SetSelectionResult {
  text: string
  stopKeeping: () => void
}

export function setSelectionInputOrTextareaElement(element: HTMLInputElement | HTMLTextAreaElement, options: Omit<SetSelectionOptions, 'keep'>) {
  element.focus()

  element.setSelectionRange(options.start, options.end)
  
  return element.value.slice(options.start, options.end)
}

export function setSelectionContenteditableElement(element: HTMLElement, options: Omit<SetSelectionOptions, 'keep'>) {
  element.focus()

  const selection = window.getSelection();
  
  if (selection && element.firstChild) {
    const range = document.createRange();
    range.setStart(element.firstChild, options.start);
    range.setEnd(element.firstChild, options.end);

    selection.removeAllRanges();
    selection.addRange(range);

    return selection.toString()
  }
  
  return ''
}

export function setSelection(element: HTMLElement, options: SetSelectionOptions): SetSelectionResult {
  const _options = defu(options, {
    start: 0,
    end: 0,
    keep: false
  })
  let selectedText = ''

  element.focus()

  if (isInputOrTextarea(element)) {
    selectedText = setSelectionInputOrTextareaElement(element as HTMLInputElement | HTMLTextAreaElement, { start: _options.start, end: _options.end })
  } else {
    selectedText = setSelectionContenteditableElement(element, { start: _options.start, end: _options.end })
  }

  let stopKeeping = () => {}

  if (_options.keep) {
    stopKeeping = keepSelection(element).stop
  }

  return {
    text: selectedText,
    stopKeeping
  }
}