function logRedirection(details, newUrl) {
  // Increment the redirection count in storage
  chrome.storage.sync.get({ redirectCount: 0 }, function (data) {
    const newCount = data.redirectCount + 1;
    chrome.storage.sync.set({ redirectCount: newCount });
  });
}

function redirect(details) {
  const spellPattern = /https:\/\/www\.wowdb\.com\/spells\/(\d+)/;
  const itemPattern = /https:\/\/www\.wowdb\.com\/items\/(\d+)/;
  const npcPattern = /https:\/\/www\.wowdb\.com\/npcs\/(\d+)/;

  let match, newUrl;

  match = details.url.match(spellPattern);
  if (match && match[1]) {
    newUrl = `https://www.wowhead.com/spell=${match[1]}`;
    logRedirection(details, newUrl);
    return { redirectUrl: newUrl };
  }

  match = details.url.match(itemPattern);
  if (match && match[1]) {
    newUrl = `https://www.wowhead.com/item=${match[1]}`;
    logRedirection(details, newUrl);
    return { redirectUrl: newUrl };
  }

  match = details.url.match(npcPattern);
  if (match && match[1]) {
    newUrl = `https://www.wowhead.com/npc=${match[1]}`;
    logRedirection(details, newUrl);
    return { redirectUrl: newUrl };
  }

  return { cancel: false };
}

function updateListeners(enabled) {
  chrome.webRequest.onBeforeRequest.removeListener(redirect);
  if (enabled) {
    chrome.webRequest.onBeforeRequest.addListener(
      redirect,
      { urls: ["*://*.wowdb.com/*"] },
      ["blocking"]
    );
  }
}

chrome.storage.sync.get("enabled", function (data) {
  var isEnabled = data.enabled !== false;
  updateListeners(isEnabled);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.enabled) {
    updateListeners(changes.enabled.newValue);
  }
});
