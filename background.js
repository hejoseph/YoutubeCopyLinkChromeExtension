chrome.runtime.onInstalled.addListener(async () => {
  buildContextMenu();
});

function buildContextMenu() {
  const params = chrome.storage.sync.get("params", function (promise) {
    const params = promise.params;
    if (params === undefined) return;
    let paramsArr = [...new Set(params.split('\n').filter(Boolean))]
    paramsArr.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    for (const param of paramsArr) {
      chrome.contextMenus.create({
        id: param,
        title: param,
        type: 'normal',
        contexts: ['all']
      });
    }

  });
}

chrome.storage.onChanged.addListener(({ params }) => {
  console.log("params value has changed " + params)
  if (typeof params === 'undefined') return;

  const currentParamsArr = new Set(params.newValue.split("\n").filter(Boolean));
  const oldParamsArr = new Set((params.oldValue ?? "").split("\n").filter(Boolean));
  const allParams = Array.from(new Set([...currentParamsArr, ...oldParamsArr]));
  allParams.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  const changes = allParams.map((param) => ({
    param,
    added: currentParamsArr.has(param) && !oldParamsArr.has(param),
    removed: !currentParamsArr.has(param) && oldParamsArr.has(param)
  }));

  for (const { param, added, removed } of changes) {
    if (added) {
    } else if (removed) {
      chrome.contextMenus.remove(param);
    } else {
      chrome.contextMenus.remove(param);
    }
  }

  for (const { param, added, removed } of changes) {
    if (!removed) {
      chrome.contextMenus.create({
        id: param,
        title: param,
        type: 'normal',
        contexts: ['all']
      });
    }
  }

});

function addValueToArrayProperty(obj, key, value) {
  if (obj.hasOwnProperty(key)) {
    if (Array.isArray(obj[key])) {
      obj[key].push(value);
    } else {
      obj[key] = [obj[key], value];
    }
  } else {
    obj[key] = [value];
  }
}

chrome.contextMenus.onClicked.addListener((item, tab) => {
  const paramId = item.menuItemId;
  let url = item.linkUrl;

  if(url===undefined)return;

  const match = url.match(/^(https:\/\/www\.youtube\.com\/watch\?v=.{11}).*/);
  url =  match ? match[1] : url;
  chrome.storage.sync.get("listLinks", function (promise) {
    const listLinks = promise.listLinks;
    let newListLinks;
    if (!listLinks) {
      newListLinks = { paramId: [url] }
    } else {
      let listObj = (listLinks);
      addValueToArrayProperty(listObj, paramId, url);
      newListLinks = listObj;
    }
    chrome.storage.sync.set({ "listLinks": newListLinks });
  });
});