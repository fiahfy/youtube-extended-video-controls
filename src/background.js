import logger from './utils/logger'
import './assets/icon16.png'
import './assets/icon48.png'
import './assets/icon128.png'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  logger.log('chrome.tabs.onUpdated', tabId, changeInfo, tab)
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { id: 'urlChanged' })
  }
})

logger.log('background script loaded')
