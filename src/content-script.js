import browser from 'webextension-polyfill'
import className from './constants/class-name'
import forward from './assets/forward.svg'
import replay from './assets/replay.svg'

let timer = null
let interval = 100
let timeout = 3000

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
  button.disabled = true
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

const setupControls = () => {
  const controls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  for (let config of buttonConfigs) {
    if (document.querySelector(`.${config.className}`)) {
      continue
    }

    const button = createButton({ ...config })
    controls.append(button)
  }

  const bar = document.querySelector(
    '.ytp-chrome-bottom .ytp-progress-bar-container'
  )
  if (!bar) {
    return
  }

  const disabled = bar.getAttribute('aria-disabled') === 'true'

  for (let config of buttonConfigs) {
    const button = document.querySelector(`.${config.className}`)
    if (!button) {
      continue
    }
    button.disabled = disabled
  }
}

const setupControlsLoop = async () => {
  return new Promise((resolve) => {
    if (timer) {
      clearInterval(timer)
    }

    const expire = Date.now() + timeout
    timer = setInterval(() => {
      if (Date.now() > expire) {
        clearInterval(timer)
        resolve()
        return
      }
      setupControls()
    }, interval)
  })
}

const setup = async () => {
  let video = document.querySelector('video.html5-main-video')
  if (video) {
    video.removeEventListener('loadedmetadata', setupControlsLoop)
  }

  await setupControlsLoop()

  video = document.querySelector('video.html5-main-video')
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', setupControlsLoop)
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id } = message
  switch (id) {
    case 'urlChanged':
      setup()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  setup()
})
