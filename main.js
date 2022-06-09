const ipc = require("electron").ipcRenderer;

const delay = (ms) => new Promise((res) => setTimeout(res, ms)); // await.sleep in js when

window.onload = window.onresize = function () {
  fit = new FitAddon.FitAddon();
  tty.loadAddon(fit);

  fit.fit();
};

let tty = new Terminal({
  convertEol: true,
  fontFamily: `'JetBrains Mono', monospace`,
  fontSize: 15,
  rendererType: "dom",
});

tty.open(document.getElementById("tty"));

tty.onData((t) => {
  ipc.send("tty.toTerm", t);
});
ipc.on("tty.incData", function (env, data) {
  tty.write(data);
});
