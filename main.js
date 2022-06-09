const ipc = require("electron").ipcRenderer;

let tty = new Terminal();

tty.open(document.getElementById("tty"));

tty.onData((t) => {
  ipc.send("tty.toTerm", t);
});
ipc.on("tty.incData", function (env, data) {
  tty.write(data);
});
