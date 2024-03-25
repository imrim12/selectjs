export function select(element: HTMLElement, options: {
  start: number,
  end: number,
  deselecAll?: boolean
}) {
  const selection = window.getSelection();

  if (selection) {
    if (options.deselecAll) {
      selection.removeAllRanges();
    }

    const range = document.createRange();
    range.setStart(element, options.start);
    range.setEnd(element, options.end);

    selection.addRange(range);
  }
}
