import { Clipboard } from 'ts-clipboard'
import { ShortenURL } from "./amzn_url_shorter"
import { allowDomains } from "./allow_domains"

const queryInfo: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true
};

const conditions = ():chrome.declarativeContent.PageStateMatcher[] => {
  let ret = new Array<chrome.declarativeContent.PageStateMatcher>()
  allowDomains.map((value: string, idx: number, array: string[]) => {
    ret.push(
      new chrome.declarativeContent.PageStateMatcher({ pageUrl: { hostEquals: value } })
    )
  })
  return ret
}

chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when a page's URL contains
          conditions: conditions(),
          actions: [new chrome.declarativeContent.ShowPageAction()],
        },
      ])
    });
});


chrome.pageAction.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  let url: string = tab.url
  if (url === "") {
    return
  }
  const shortURL = await ShortenURL(url)
  Clipboard.copy(shortURL)
  let opt: chrome.notifications.NotificationOptions = {
    type: 'basic',
    title: 'Copied!',
    message: shortURL,
    iconUrl: 'images/icon_48.png',
    priority: 1,
    isClickable: false,
  }
  chrome.notifications.create('', opt, (notificationId: string) => {
    console.log(notificationId)
  })
})
