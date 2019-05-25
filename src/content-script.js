import browser from 'webextension-polyfill'
import className from './constants/class-name'
import forward from './assets/forward.svg'
import replay from './assets/replay.svg'

const buttonConfigs = [
  {
    svg: replay,
    title: 'Seek backward 5s（←）',
    keyCode: 37,
    className: className.backwordButton
  },
  {
    svg: forward,
    title: 'Seek forward 5s（→）',
    keyCode: 39,
    className: className.forwordButton
  }
]

const getDisabledState = () => {
  return new Promise((resolve) => {
    const timeout = Date.now() + 3000
    const timer = setInterval(() => {
      const bar = document.querySelector(
        '.ytp-chrome-bottom .ytp-progress-bar-container'
      )
      if (bar) {
        clearInterval(timer)
        const disabled = bar.getAttribute('aria-disabled') === 'true'
        resolve(disabled)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        resolve(false)
      }
    }, 100)
  })
}

const createButton = (config) => {
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
  button.innerHTML = config.svg

  const svg = button.querySelector('svg')
  svg.setAttribute('viewBox', '-8 -8 40 40')
  svg.style.fill = 'white'

  return button
}

const setupControlButtons = async () => {
  const controls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  const disabled = await getDisabledState()

  for (let config of buttonConfigs) {
    const oldButton = document.querySelector(`.${config.className}`)
    oldButton && oldButton.remove()

    const button = createButton({ ...config, disabled })
    controls.append(button)
  }
}

browser.runtime.onMessage.addListener((message) => {
  const { id, type } = message
  if (type === 'SIGN_RELOAD' && process.env.NODE_ENV !== 'production') {
    parent.location.reload()
    return
  }
  switch (id) {
    case 'urlChanged':
      setupControlButtons()
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  setupControlButtons()
})
