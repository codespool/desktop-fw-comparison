const { contextBridge } = require("electron");
const { spawn } = require("child_process");

contextBridge.exposeInMainWorld("runtimeStarter", {
  startRuntime,
  stopRuntime,
});

let ls;
function startRuntime(outputElement) {
  ls = spawn("./bin/astar-collator", ["--dev", "--tmp"]);

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    addText(outputElement, data);
  });

  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    addText(outputElement, data);
  });

  ls.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function stopRuntime(outputElement) {
  ls.kill("SIGINT");
  outputElement.innerHTML = "";
}

function addText(targetElement, text) {
  const textNode = document.createTextNode(text);
  targetElement.appendChild(textNode);
  const parent = targetElement.parentElement;
  parent.scroll({ top: parent.scrollHeight, behavior: "smooth" });
}
