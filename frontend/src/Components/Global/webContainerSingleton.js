import { WebContainer } from "@webcontainer/api";

let instance = null;
let booted = false

export async function getWebContainerInstance() {
    console.log("Building")
  if (!booted) {
    booted = true
    instance = await WebContainer.boot();
  }
  return instance;
}

export async function teardownWebContainer() {
    console.log("Tearing Down")
  if (instance) {
    await instance.teardown();
    booted = false
    instance = null;
  }
}

export function setupTeardownOnUnload() {
  window.addEventListener("beforeunload", async () => {
    await teardownWebContainer();
  });
}
