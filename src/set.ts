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

export function setSelectionNode(node: Node, options?: SetSelectionOptions) {
  const _options = defu(options, {
    keep: false
  })

  const selection = window.getSelection();
  const range = document.createRange();

  range.setStart(node, _options.start);
  range.setEnd(node, _options.end);

  selection?.removeAllRanges();
  selection?.addRange(range);
  return selection?.toString()
}

export function setSelectionContenteditableElement(element: HTMLElement, options?: SetSelectionOptions) {
  const _options = defu(options, {
    keep: false
  })

  const _element = defineSelectable(element, _options)

  _element.focus()

  const selection = window.getSelection();

  if (selection) {
    let charCount = 0,
    startNode: Node | undefined,
    startOffset = 0,
    endNode: Node | undefined,
    endOffset = 0

    function traverseNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + Number(node.textContent?.length);
        if (!startNode && _options.start >= charCount && _options.start < nextCharCount) {
          startNode = node;
          startOffset = _options.start - charCount;
        }
        if (!endNode && _options.end >= charCount && _options.end <= nextCharCount) {
          endNode = node;
          endOffset = _options.end - charCount;
        }
        charCount = nextCharCount;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length && !endNode; i++) {
          traverseNodes(node.childNodes[i]);
        }
      }
    }

    traverseNodes(element);

    const range = document.createRange();
    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      selection.removeAllRanges();
      selection.addRange(range);
      return selection.toString()
    }
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
