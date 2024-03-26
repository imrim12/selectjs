import defu from 'defu'

import { isInputOrTextarea } from './utils'
import { keepSelection } from './keep'
import { defineSelectable } from './define'

export interface SetSelectionOptions {
  start: number,
  end: number,
  keep?: boolean
}

export interface SetSelectionResult {
  text: string
  stopKeeping: () => void
}

export function setSelectionInputOrTextareaElement(element: HTMLInputElement | HTMLTextAreaElement, options?: SetSelectionOptions) {
  const _options = defu(options, {
    keep: false
  })

  const _element = defineSelectable(element, _options)

  _element.focus()

  _element.setSelectionRange(_options.start, _options.end)

  return _element.value.slice(_options.start, _options.end)
}

export function setSelectionContenteditableElement(element: HTMLElement, options?: SetSelectionOptions) {
  const _options = defu(options, {
    keep: false
  })

  const _element = defineSelectable(element, _options)

  _element.focus()

  const selection = window.getSelection();

  if (selection && _element.firstChild) {
    const range = document.createRange();
    range.setStart(_element.firstChild, _options.start);
    range.setEnd(_element.firstChild, _options.end);

    selection.removeAllRanges();
    selection.addRange(range);

    return selection.toString()
  }

  return ''
}

export function setSelection(element: HTMLElement, options: SetSelectionOptions): SetSelectionResult {
  const _options = defu(options, {
    keep: false
  })

  const _element = defineSelectable(element, options)

  let selectedText = ''

  _element.focus()

  if (isInputOrTextarea(_element)) {
    selectedText = setSelectionInputOrTextareaElement(_element as HTMLInputElement | HTMLTextAreaElement, { start: _options.start, end: _options.end })
  } else {
    selectedText = setSelectionContenteditableElement(_element, { start: _options.start, end: _options.end })
  }

  let stopKeeping = () => {}

  if (_options.keep) {
    stopKeeping = keepSelection(_element).stop
  }

  return {
    text: selectedText,
    stopKeeping
  }
}
