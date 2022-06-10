const { app, BrowserWindow, ipcMain } = require("electron");
const nodeOs = require("os");
const nodePty = require("node-pty");
const fs = require("fs");

let configData;

try {
  configData = fs.readFileSync("config.txt", "utf8");
  if (configData === "zsh:true") {
    configData = true;
  }
} catch (e) {
  console.log("Error:", e.stack);
}

let shell;
if (nodeOs.platform() === "win32") {
  shell = "powershell.exe";
} else if (configData === true) {
  shell = "zsh";
  console.log("Using ZSH instead of BASH!");
} else {
  shell = "bash";
}

const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 825,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.menuBarVisible = false;

  let nodePtyShellThing = nodePty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env,
    cursorBlink: true,
  });

  nodePtyShellThing.onData(function (data) {
    mainWindow.webContents.send("tty.incData", data);
  });

  ipcMain.on("tty.toTerm", function (event, data) {
    nodePtyShellThing.write(data);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
