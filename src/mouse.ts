let mouseX = 0
let mouseY = 0

let watcherStarted = false

function onMousemove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

export function watchMouseMovement() {
  if (!watcherStarted) {
    document.addEventListener('mousemove', onMousemove)

    watcherStarted = true
  }

  return {
    stop: () => {
      document.removeEventListener('mousemove', onMousemove)
    },
  }
}

export function getMousePos() {
  return {
    x: mouseX,
    y: mouseY,
  }
}

export function isMouseInBound(element: HTMLElement) {
  const rect = element.getBoundingClientRect()

  return (
    mouseX >= rect.left
    && mouseX <= rect.right
    && mouseY >= rect.top
    && mouseY <= rect.bottom
  )
}
