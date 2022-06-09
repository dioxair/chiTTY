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

tty.write("Welcome to chiTTY!\n");

tty.write("You can configure chiTTY to use ZSH in the config.txt file!\n");

tty.write(
  'The file can only contain "zsh:true" or "zsh:false", or else it will just default to Bash.'
);

tty.onData((t) => {
  ipc.send("tty.toTerm", t);
});
ipc.on("tty.incData", function (env, data) {
  tty.write(data);
});
