import defu from 'defu'

import { isInputOrTextarea } from './utils'
import { defineSelectable } from './define'
import { disableEffect } from './effect'

export interface SetSelectionOptions {
  start: number
  end: number
  noEffect?: boolean
}

export function setSelectionInputOrTextareaElement(element: HTMLInputElement | HTMLTextAreaElement, options?: SetSelectionOptions) {
  const _options = defu(options, {})

  if (_options.noEffect)
    disableEffect()

  const _element = defineSelectable(element)

  _element.focus()

  _element.setSelectionRange(_options.start, _options.end, 'none')

  return _element.value.slice(_options.start, _options.end)
}

interface SetSelectionNodeOptions {
  nativeSelection: {
    startNode: Node | null
    startOffset: number
    endNode: Node | null
    endOffset: number
  }
  noEffect?: boolean
}

export function setSelectionNode(options?: SetSelectionNodeOptions) {
  const _options = defu(options, {})

  if (_options.noEffect)
    disableEffect()

  const selection = window.getSelection()
  const range = document.createRange()

  if (_options.nativeSelection.startNode && _options.nativeSelection.endNode) {
    range.setStart(_options.nativeSelection.startNode, _options.nativeSelection.startOffset)
    range.setEnd(_options.nativeSelection.endNode, _options.nativeSelection.endOffset)

    selection?.removeAllRanges()
    selection?.addRange(range)
    return selection?.toString()
  }

  return ''
}

export function setSelectionContenteditableElement(element: HTMLElement, options?: SetSelectionOptions) {
  const _options = defu(options, {})

  if (_options.noEffect)
    disableEffect()

  const _element = defineSelectable(element)

  _element.focus()

  const selection = window.getSelection()

  if (selection) {
    let charCount = 0
    let startNode: Node | undefined
    let startOffset = 0
    let endNode: Node | undefined
    let endOffset = 0

    function traverseNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + Number(node.textContent?.length)
        if (!startNode && _options.start >= charCount && _options.start < nextCharCount) {
          startNode = node
          startOffset = _options.start - charCount
        }
        if (!endNode && _options.end >= charCount && _options.end <= nextCharCount) {
          endNode = node
          endOffset = _options.end - charCount
        }
        charCount = nextCharCount
      }
      else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length && !endNode; i++)
          traverseNodes(node.childNodes[i])
      }
    }

    traverseNodes(element)

    const range = document.createRange()
    if (startNode && endNode) {
      range.setStart(startNode, startOffset)
      range.setEnd(endNode, endOffset)
      selection.removeAllRanges()
      selection.addRange(range)
      return selection.toString()
    }
  }

  return ''
}

export function setSelection(element: HTMLElement, options: SetSelectionOptions) {
  const _options = defu(options, {})

  const _element = defineSelectable(element)

  let selectedText = ''

  _element.focus()

  if (isInputOrTextarea(_element))
    selectedText = setSelectionInputOrTextareaElement(_element as HTMLInputElement | HTMLTextAreaElement, { start: _options.start, end: _options.end, noEffect: _options.noEffect })
  else
    selectedText = setSelectionContenteditableElement(_element, { start: _options.start, end: _options.end, noEffect: _options.noEffect })

  return selectedText
}
