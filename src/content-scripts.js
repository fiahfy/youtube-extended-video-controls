import logger from './utils/logger'
import className from './constants/class-name'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

const createBackwardButton = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z'
  )
  path.setAttribute('fill', '#fff')

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '-8 -8 40 40')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.append(path)

  const button = document.createElement('button')
  button.classList.add(className.controlButton)
  button.classList.add('ytp-button')
  button.style.opacity = 0
  button.style.transition = 'opacity .5s'
  button.onclick = () => {
    // TODO:
  }
  button.append(svg)
}

const createForwardButton = () => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z'
  )
  path.setAttribute('fill', '#fff')

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '-8 -8 40 40')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.append(path)

  const button = document.createElement('button')
  button.classList.add(className.controlButton)
  button.classList.add('ytp-button')
  button.style.opacity = 0
  button.style.transition = 'opacity .5s'
  button.onclick = () => {
    // TODO:
  }
  button.append(svg)
}

const addControlButtons = () => {
  const controls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  const backward = createBackwardButton()
  const forward = createForwardButton()

  controls.prepend(backward)
  controls.prepend(forward)

  // fade in...
  setTimeout(() => {
    backward.style.opacity = 1
    forward.style.opacity = 1
  }, 0)
}

const removeControlButtons = () => {
  Array.from(document.querySelectorAll(`.${className.controlButton}`)).forEach(
    (button) => {
      button && button.remove()
    }
  )
}

document.addEventListener('DOMContentLoaded', () => {
  addControlButtons()

  window.addEventListener('unload', () => {
    removeControlButtons()
  })
})

logger.log('content script loaded')
