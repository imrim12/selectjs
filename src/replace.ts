import { setSelection } from './set'
import { isInputOrTextarea } from './utils'

interface ReplaceSelectionContentOptions {
  content: string
  start?: number
  end?: number
}

export function replaceSelectionContent(element: HTMLElement, options: ReplaceSelectionContentOptions) {
  if (isInputOrTextarea(element)) {
    const _inputOrTextarea = element as HTMLInputElement | HTMLTextAreaElement
    const textBefore = _inputOrTextarea.value.substring(0, options.start || 0)
    const textAfter = _inputOrTextarea.value.substring(options.end || 0)

    _inputOrTextarea.value = textBefore + options.content + textAfter

    setSelection(_inputOrTextarea, {
      start: textBefore.length,
      end: textBefore.length + options.content.length,
      noEffect: true,
    })
  }
  else {
    const selection = window.getSelection()
    if (!selection?.rangeCount)
      return

    const range = selection.getRangeAt(0)

    range.deleteContents()

    const div = document.createElement('div')
    div.innerHTML = options.content

    const fragment = document.createDocumentFragment()
    let lastNode: Node | undefined
    while (div.firstChild) { // Check if there are still child nodes in the div
      lastNode = div.firstChild
      fragment.appendChild(lastNode)
    }

    range.insertNode(fragment)

    range.commonAncestorContainer.normalize()

    return range
  }
}
