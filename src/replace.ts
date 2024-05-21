import { getProp } from './define'
import { getNativeSelection } from './get'
import { setSelection, setSelectionNode } from './set'
import { isInputOrTextarea } from './utils'

interface ReplaceSelectionContentOptions {
  content: string
  start?: number
  end?: number
}

export function replaceSelectionContent(element: HTMLElement, options: ReplaceSelectionContentOptions) {
  const disabled = getProp(element, 'disabled')

  if (disabled === 'true')
    return

  if (isInputOrTextarea(element)) {
    const _inputOrTextarea = element as HTMLInputElement | HTMLTextAreaElement
    const textBefore = _inputOrTextarea.value.substring(0, options.start || 0)
    const textAfter = _inputOrTextarea.value.substring(options.end || 0)

    _inputOrTextarea.value = textBefore + options.content + textAfter

    element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))

    setSelection(_inputOrTextarea, {
      start: textBefore.length,
      end: textBefore.length + options.content.length,
      direction: 'forward',
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

    element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }))

    const currentNativeSelection = getNativeSelection()
    setSelectionNode(element, {
      nativeSelection: currentNativeSelection,
    })

    return range
  }
}
