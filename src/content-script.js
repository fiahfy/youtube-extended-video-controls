import logger from './utils/logger'
import className from './constants/class-name'

const buttonConfigs = [
  {
    path:
      'M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1.3 8.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1s.3.2.4.3.2.3.3.5.1.4.1.6c0 .2 0 .4-.1.5s-.1.3-.3.5-.3.2-.4.3-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.3-.1-.5h.8c0 .2.1.3.2.4s.2.1.4.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.7z',
    title: 'Seek backward 5s（←）',
    keyCode: 37,
    className: className.backwordButton
  },
  {
    path:
      'M4 13c0 4.4 3.6 8 8 8s8-3.6 8-8h-2c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4l5-5-5-5v4c-4.4 0-8 3.6-8 8zm6.7.9l.2-2.2h2.4v.7h-1.7l-.1.9s.1 0 .1-.1.1 0 .1-.1.1 0 .2 0h.2c.2 0 .4 0 .5.1s.3.2.4.3.2.3.3.5.1.4.1.6c0 .2 0 .4-.1.5s-.1.3-.3.5-.3.2-.5.3-.4.1-.6.1c-.2 0-.4 0-.5-.1s-.3-.1-.5-.2-.2-.2-.3-.4-.1-.3-.1-.5h.8c0 .2.1.3.2.4s.2.1.4.1c.1 0 .2 0 .3-.1l.2-.2s.1-.2.1-.3v-.6l-.1-.2-.2-.2s-.2-.1-.3-.1h-.2s-.1 0-.2.1-.1 0-.1.1-.1.1-.1.1h-.6z',
    title: 'Seek forward 5s（→）',
    keyCode: 39,
    className: className.forwordButton
  }
]

const waitVideoReady = () => {
  return new Promise((resolve) => {
    const time = Date.now()
    const timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if (Date.now() - time > 3000 || (video && video.readyState === 4)) {
        clearInterval(timer)
        resolve()
        return
      }
    }, 100)
  })
}

const createButton = (config) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', config.path)
  path.setAttribute('fill', '#fff')

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '-8 -8 40 40')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.append(path)

  const button = document.createElement('button')
  button.classList.add(config.className)
  button.classList.add('ytp-button')
  button.title = config.title
  button.disabled = config.disabled
  button.onclick = () => {
    const e = new KeyboardEvent('keydown', {
      bubbles: true,
      keyCode: config.keyCode
    })
    document.body.dispatchEvent(e)
  }
  button.append(svg)

  return button
}

const addControlButtons = async () => {
  await waitVideoReady()

  const bar = document.querySelector(
    '.ytp-chrome-bottom .ytp-progress-bar-container'
  )
  const disabled = !bar || bar.getAttribute('aria-disabled') === 'true'

  const controls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  for (let config of buttonConfigs) {
    const oldButton = document.querySelector(`.${config.className}`)
    oldButton && oldButton.remove()

    const button = createButton({ ...config, disabled })
    controls.append(button)
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.log('chrome.runtime.onMessage', message, sender, sendResponse)

  const { id, type } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    // reload if files changed
    parent.location.reload()
    return
  }
  switch (id) {
    case 'urlChanged':
      addControlButtons()
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  addControlButtons()
})

logger.log('content script loaded')
