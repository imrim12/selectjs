import { setSelection, setSelectionContenteditableElement } from './set'
import { isInputOrTextarea, shadowElement } from './utils'

export interface GetSelectionResult {
  text: string
  start: number
  end: number
  direction: "forward" | "backward" | "none" | null
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
  const doc = element.ownerDocument
  const win = doc.defaultView || window
  let sel
  if (typeof win.getSelection !== 'undefined') {
    sel = win.getSelection()
    if (sel?.rangeCount) {
      const range = sel.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.startContainer, range.startOffset)
      start = preCaretRange.toString().length

      preCaretRange.setEnd(range.endContainer, range.endOffset)
      end = preCaretRange.toString().length
    }
  }
  return { start, end }
}

export function getSelectionContenteditable(element: HTMLElement): GetSelectionResult {
  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)

  const { start, end } = getSelectionCharacterOffsetWithin(range?.commonAncestorContainer as HTMLElement || element)

  const clonedSelection = range!.cloneContents()

  const tempDiv = document.createElement('div')
  tempDiv.appendChild(clonedSelection)

  return {
    text: tempDiv.innerHTML || '',
    start,
    end,
    direction: 'none' as const,
  }
}

export function getSelection(element?: HTMLElement): GetSelectionResult {
  const _element = (element || document.activeElement) as HTMLElement
  
  if (isInputOrTextarea(_element)) {
    return getSelectionInputOrTextarea(_element as HTMLInputElement | HTMLTextAreaElement)
  } else {
    return getSelectionContenteditable(_element)
  }
}

export function getSelectionRect(element?: HTMLElement): GetSelectionRectResult {
  const _element = (element || document.activeElement) as HTMLElement
  let shadowEl: HTMLElement | null = null
  let selectedEnd = 0
  let selectedStart = 0
  
  if (isInputOrTextarea(_element)) {
    const _inputOrTextareaElement = _element as HTMLInputElement | HTMLTextAreaElement
    
    const _inputOrTextareaSelection = getSelectionInputOrTextarea(_inputOrTextareaElement)
    
    shadowEl = shadowElement(_inputOrTextareaElement)
    shadowEl.contentEditable = 'true'
    document.body.appendChild(shadowEl)

    setSelectionContenteditableElement(shadowEl, {
      start: _inputOrTextareaSelection.start,
      end: _inputOrTextareaSelection.end
    })
  }

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  
  const rect = range?.getBoundingClientRect().toJSON() as Rect
  const rects = Array.from(range?.getClientRects() || []).map(rect => rect.toJSON() as Rect)
  
  const rectTop = rects[0]
  const rectBottom = rects[rects.length - 1]

  const start = { x: rectTop.left, y: rectTop.top }
  const end = { x: rectBottom.right, y: rectBottom.bottom }

  setTimeout(() => {
    shadowEl && document.body.removeChild(shadowEl)

    setSelection(_element, {
      start: selectedStart,
      end: selectedEnd
    })
  }, 0)

  return {
    rect,
    children: rects,
    start,
    end,
  }
}
