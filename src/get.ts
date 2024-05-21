import { clampRect, createRelativeRect, isInputOrTextarea, shadowInput } from './utils'

export interface GetSelectionResult {
  text: string
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none' | null
}

export interface GetNativeSelectionResult {
  startNode: Node | null
  startOffset: number
  endNode: Node | null
  endOffset: number
}

export interface Position {
  x: number
  y: number
}

export interface Rect extends Position {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
}

export interface GetSelectionRectResult {
  rect: Rect | null
  children: Rect[]
  start: Position
  end: Position
}

function getDefaultSelection(): GetSelectionResult {
  return {
    text: '',
    start: 0,
    end: 0,
    direction: 'none',
  }
}

export function getSelectionInputOrTextarea(element: HTMLInputElement | HTMLTextAreaElement): GetSelectionResult {
  return {
    text: element.value.slice(element.selectionStart || 0, element.selectionEnd || 0),
    start: element.selectionStart || 0,
    end: element.selectionEnd || 0,
    direction: element.selectionDirection,
  }
}

export function getSelectionCharacterOffsetWithin(element: HTMLElement) {
  let start = 0
  let end = 0

  const selection = window.getSelection()

  if (selection?.rangeCount) {
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.startContainer, range.startOffset)
    start = preCaretRange.toString().length

    preCaretRange.setEnd(range.endContainer, range.endOffset)
    end = preCaretRange.toString().length
  }

  return { start, end }
}

export function getSelectionContenteditable(element: HTMLElement): GetSelectionResult {
  const selection = window.getSelection()

  if (!selection?.rangeCount)
    return getDefaultSelection()

  const range = selection.getRangeAt(0)

  const { start, end } = getSelectionCharacterOffsetWithin(range?.commonAncestorContainer as HTMLElement || element)

  const clonedSelection = range!.cloneContents()

  const tempDiv = document.createElement('div')
  tempDiv.appendChild(clonedSelection)

  return {
    text: tempDiv.innerHTML || range?.toString() || tempDiv.textContent || '',
    start,
    end,
    direction: 'forward' as const,
  }
}

export function getSelection(element?: HTMLElement): GetSelectionResult {
  const _element = (element || document.activeElement) as HTMLElement

  if (isInputOrTextarea(_element))
    return getSelectionInputOrTextarea(_element as HTMLInputElement | HTMLTextAreaElement)
  else
    return getSelectionContenteditable(_element)
}

export function getNativeSelection(): GetNativeSelectionResult {
  const nativeSelection = window.getSelection()!

  const startNode = nativeSelection.anchorNode
  const startOffset = nativeSelection.anchorOffset
  const endNode = nativeSelection.focusNode
  const endOffset = nativeSelection.focusOffset

  return {
    startNode,
    startOffset,
    endNode,
    endOffset,
  }
}

export function getSelectionRect(element?: HTMLElement): GetSelectionRectResult {
  const _element = (element || document.activeElement) as HTMLElement

  function processRect(domRect: DOMRect): Rect {
    let _rect = domRect.toJSON()
    if (isInputOrTextarea(_element))
      _rect = createRelativeRect(_rect, _element.scrollLeft, _element.scrollTop)

    _rect = clampRect(_rect, _element.getBoundingClientRect().toJSON())

    return _rect
  }

  let shadowEl: HTMLElement | null = null
  let inputRect: DOMRect | null = null
  let inputRects: DOMRect[] | null = null

  if (isInputOrTextarea(_element)) {
    const _inputOrTextareaElement = _element as HTMLInputElement | HTMLTextAreaElement

    const shadowWrapper = shadowInput(_inputOrTextareaElement)
    document.body.appendChild(shadowWrapper.shadowEl)

    shadowEl = shadowWrapper.shadowEl

    inputRect = shadowWrapper.highlightEl.getBoundingClientRect()
    inputRects = Array.from(shadowWrapper.highlightEl.getClientRects())

    document.body.removeChild(shadowEl)
  }

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)

  const rect = clampRect(
    processRect(inputRect || range!.getBoundingClientRect()),
    _element?.getBoundingClientRect().toJSON(),
  )

  const rects = Array.from(inputRects || range?.getClientRects() || []).map(processRect)

  const rectTop = rects[0]
  const rectBottom = rects[rects.length - 1]

  const start = { x: rectTop?.left || 0, y: rectTop?.top || 0 }
  const end = { x: rectBottom?.right || 0, y: rectBottom?.bottom || 0 }

  return {
    rect,
    children: rects.filter(Boolean) as Rect[],
    start,
    end,
  }
}
