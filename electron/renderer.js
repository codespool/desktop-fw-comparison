const state = {
  runtimeRunning: false,
  textContent: (isRunning) => (isRunning ? "Stop" : "Start"),
};

const buttonElem = document.querySelector("#startRuntime");

buttonElem.addEventListener("click", () => {
  const outputElement = document.querySelector("#output");
  if (state.runtimeRunning) {
    window.runtimeStarter.stopRuntime(outputElement);
  } else {
    window.runtimeStarter.startRuntime(outputElement);
  }
  state.runtimeRunning = !state.runtimeRunning;
  buttonElem.textContent =
    state.textContent(state.runtimeRunning) + " local runtime";
});
