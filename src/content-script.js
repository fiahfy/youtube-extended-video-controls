import browser from 'webextension-polyfill'
import className from './constants/class-name'
import forward from './assets/forward.svg'
import replay from './assets/replay.svg'

let timer = null
let oldSrc = null

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

const createButton = (config) => {
  const button = document.createElement('button')
  button.classList.add(config.className)
  button.classList.add('ytp-button')
  button.title = config.title
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

  for (let config of buttonConfigs) {
    if (document.querySelector(`.${config.className}`)) {
      return
    }

    const button = createButton({ ...config })
    controls.append(button)
  }
}

const waitVideoReady = () => {
  clearInterval(timer)

  return new Promise((resolve) => {
    const timeout = Date.now() + 10000
    timer = setInterval(() => {
      const video = document.querySelector('video.html5-main-video')
      if (video && video.currentSrc !== oldSrc && video.readyState === 4) {
        clearInterval(timer)
        oldSrc = video.currentSrc
        resolve(true)
      } else if (Date.now() > timeout) {
        clearInterval(timer)
        resolve(false)
      }
    })
  })
}

const updateSeekButtons = async () => {
  const ready = await waitVideoReady()

  const bar = document.querySelector(
    '.ytp-chrome-bottom .ytp-progress-bar-container'
  )
  const disabled = bar && bar.getAttribute('aria-disabled') === 'true'

  for (let config of buttonConfigs) {
    const button = document.querySelector(`.${config.className}`)
    if (!button) {
      return
    }
    button.disabled = ready && disabled
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
      updateSeekButtons()
      break
  }
})

document.addEventListener('DOMContentLoaded', () => {
  setupControlButtons()
  updateSeekButtons()
})
