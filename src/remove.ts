import { isInputOrTextarea } from './utils'

interface RemoveSelectionContentOptions {
  start: number
  end: number
}

export function removeSelectionContent(element: HTMLElement, options: RemoveSelectionContentOptions) {
  if (isInputOrTextarea(element)) {
    const _inputOrTextarea = element as HTMLInputElement | HTMLTextAreaElement

    const beforeSelection = _inputOrTextarea.value.substring(0, options.start)
    const afterSelection = _inputOrTextarea.value.substring(options.end, _inputOrTextarea.value.length)

    _inputOrTextarea.value = beforeSelection + afterSelection

    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))
  }
  else {
    const selection = window.getSelection()
    if (!selection?.rangeCount)
      return

    const range = selection.getRangeAt(0)
    range.deleteContents()

    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))

    return range
  }
}
