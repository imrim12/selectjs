export function replaceSelectionContent(content: string) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);

  range.deleteContents();

  const div = document.createElement('div');
  div.innerHTML = content;

  const fragment = document.createDocumentFragment();
  let lastNode: Node | undefined;
  while (div.firstChild) { // Check if there are still child nodes in the div
    lastNode = div.firstChild
    fragment.appendChild(lastNode);
  }

  range.insertNode(fragment);

  range.commonAncestorContainer.normalize()

  return range;
}
