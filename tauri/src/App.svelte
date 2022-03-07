<script lang="ts">
  import { Command } from "@tauri-apps/api/shell";
  import { onMount } from "svelte";
  let output;

  let isRunning = false;
  let childProc = null;
  $: buttonText = isRunning ? "Stop" : "Start";
  const command = new Command("start-runtime", ["--dev", "--tmp"]);

  command.on("error", (error) => console.error(`command error: "${error}"`));
  command.stdout.on("data", (line) => {
    addText(output, line);
    console.log(`command stdout: "${line}"`);
  });
  command.stderr.on("data", (line) => {
    addText(output, line);
    console.log(`command stderr: "${line}"`);
  });

  function handleClick() {
    if (isRunning) {
      stopRuntime();
    } else {
      startRuntime();
    }
    isRunning = !isRunning;
    console.log(isRunning);
  }

  async function startRuntime() {
    childProc = await command.spawn();
    console.log("started", childProc);
  }

  function stopRuntime() {
    if (childProc) childProc.kill();
    output.innerHTML = "";
    console.log("killed", childProc);
  }

  function addText(targetElement, text) {
    const textNode = document.createTextNode(text);
    targetElement.appendChild(textNode);
    const parent = targetElement.parentElement;
    parent.scroll({ top: parent.scrollHeight, behavior: "smooth" });
  }
</script>

<main>
  <header>
    <img alt="astar logo" src="./img/brand-logo-mark.png" />
    <button on:click={handleClick}>{buttonText} local runtime</button>
  </header>
  <section>
    <div bind:this={output} id="output" />
  </section>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    height: 85vh;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  img {
    height: 8rem;
  }
  button {
    border-radius: 5px;
    padding: 20px;
    background-color: #5641c1;
    color: whitesmoke;
    font-weight: 600;
    cursor: pointer;
  }
  button:active {
    background-color: #0570c0;
  }
  section {
    margin-top: 2rem;
    border: #5641c1 1px solid;
    flex-grow: 1;
    padding: 2rem;
    overflow: auto;
    background-color: lightcyan;
  }

  #output {
    font-family: "Courier New", Courier, monospace;
    font-size: smaller;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
