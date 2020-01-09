import { browser } from 'webextension-polyfill-ts'
import className from './constants/class-name'
import forward from './assets/forward.svg'
import replay from './assets/replay.svg'

type ButtonConfig = {
  title: string
  className: string
  svg: string
  key: string
  code: string
  keyCode: number
}

let timer = -1
const interval = 100
const timeout = 3000

const buttonConfigs: ButtonConfig[] = [
  {
    title: 'Seek backward 5s（←）',
    className: className.backwordButton,
    svg: replay,
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37
  },
  {
    title: 'Seek forward 5s（→）',
    className: className.forwordButton,
    svg: forward,
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39
  }
]

const createButton = (config: ButtonConfig): HTMLButtonElement => {
  const button = document.createElement('button')
  button.classList.add(config.className)
  button.classList.add('ytp-button')
  button.title = config.title
  button.disabled = true
  button.onclick = (): void => {
    const e = new KeyboardEvent('keydown', {
      bubbles: true,
      key: config.key,
      code: config.code,
      keyCode: config.keyCode
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    document.documentElement.dispatchEvent(e)
  }
  button.innerHTML = config.svg

  const svg = button.querySelector('svg')
  if (svg) {
    svg.setAttribute('viewBox', '-8 -8 40 40')
    svg.style.fill = 'white'
  }

  return button
}

const setupControls = (): void => {
  const controls = parent.document.querySelector(
    '.ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls'
  )
  if (!controls) {
    return
  }

  for (const config of buttonConfigs) {
    if (document.querySelector(`.${config.className}`)) {
      continue
    }

    const button = createButton(config)
    controls.append(button)
  }

  const bar = document.querySelector(
    '.ytp-chrome-bottom .ytp-progress-bar-container'
  )
  if (!bar) {
    return
  }

  const disabled = bar.getAttribute('aria-disabled') === 'true'

  for (const config of buttonConfigs) {
    const button = document.querySelector(
      `.${config.className}`
    ) as HTMLButtonElement | null
    button && (button.disabled = disabled)
  }
}

const setupControlsLoop = async (): Promise<void> => {
  return new Promise((resolve) => {
    const video = document.querySelector('video.html5-main-video')
    if (video) {
      video.removeEventListener('loadedmetadata', setupControlsLoop)
    }

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

const setup = async (): Promise<void> => {
  await setupControlsLoop()

  const video = document.querySelector(
    'video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video || video.readyState > 0) {
    return
  }
  video.addEventListener('loadedmetadata', setupControlsLoop)
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id } = message
  switch (id) {
    case 'urlChanged':
      return await setup()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  await setup()
})
