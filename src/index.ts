import defu from 'defu'

interface SelectOptions {
  start: number,
  end: number,
  keep?: boolean
}

interface SelectResult {
  text: string
  stopKeeping: () => void
}

export function isInputOrTextarea(element: HTMLElement) {
  return (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')
}

export function select(element: HTMLElement, options: SelectOptions): SelectResult {
  const _options = defu(options, {
    start: 0,
    end: 0,
    keep: false
  })
  let selectedText = ''

  element.focus()

  if (isInputOrTextarea(element)) {
    const _el = element as HTMLInputElement | HTMLTextAreaElement

    _el.setSelectionRange(options.start, options.end)

    selectedText = _el.value.slice(_options.start, _options.end)
  } else {
    const selection = window.getSelection();
  
    if (selection && element.firstChild) {
      const range = document.createRange();
      range.setStart(element.firstChild, _options.start);
      range.setEnd(element.firstChild, _options.end);
  
      selection.removeAllRanges();
      selection.addRange(range);
  
      selectedText = selection.toString()
    }
  }

  function reselectElement() {
    select(element, { start: _options.start, end: _options.end })
  }

  if (_options.keep) {
    element.addEventListener('blur', reselectElement)
  }
  
  function removeKeepListener() {
    element.removeEventListener('blur', reselectElement)
  }

  return {
    text: selectedText,
    stopKeeping: removeKeepListener
  }
}
