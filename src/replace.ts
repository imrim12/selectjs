export function replaceSelectionContent(content: string) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const div = document.createElement('div');
  div.innerHTML = content

  const fragment = document.createDocumentFragment();
  let lastNode;
  while ((lastNode = div.firstChild)) {
    lastNode = fragment.appendChild(lastNode);
  }
  range.insertNode(fragment);

  if (lastNode) {
    range.setStartAfter(lastNode);
    range.setEndAfter(lastNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return range
}
