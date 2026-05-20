function trackShiyiEvent(eventName, params = {}) {
  if (typeof gtag !== "function") {
    return;
  }

  gtag("event", eventName, {
    project_name: "shanhaishiyi",
    ...params
  });
}

window.trackShiyiEvent = trackShiyiEvent;