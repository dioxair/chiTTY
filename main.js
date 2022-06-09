const ipc = require("electron").ipcRenderer;

let tty = new Terminal({
  convertEol: true,
  fontFamily: `'JetBrains Mono', monospace`,
  fontSize: 15,
  rendererType: "dom",
});

fit = new FitAddon.FitAddon();
tty.loadAddon(fit);

tty.open(document.getElementById("tty"));

fit.fit();

tty.onData((t) => {
  ipc.send("tty.toTerm", t);
});
ipc.on("tty.incData", function (env, data) {
  tty.write(data);
});
