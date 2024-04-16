export function collapseToEnd() {
  const selection = window.getSelection()

  selection?.collapseToEnd()
}

export function collapseToStart() {
  const selection = window.getSelection()

  selection?.collapseToStart()
}
