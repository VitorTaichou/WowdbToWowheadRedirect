document.addEventListener("DOMContentLoaded", function () {
  var toggleSwitch = document.getElementById("toggle-switch");
  var redirectCountElement = document.getElementById("redirect-count");

  // Load the current state and redirection count from storage
  chrome.storage.sync.get(["enabled", "redirectCount"], function (data) {
    toggleSwitch.checked = data.enabled !== false; // Default to enabled
    redirectCountElement.textContent = data.redirectCount || 0; // Default to 0
  });

  // Update the state when the switch is toggled
  toggleSwitch.addEventListener("change", function () {
    var isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
  });
});
