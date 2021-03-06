const {
  app,
  BrowserWindow
} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Write = require('../write.js');
const write = new Write({
  // We'll call our data file 'user-preferences'
  configName: 'config',
  defaults: {
    // 800x600 is the default size of our window
    bounds: { width: 800, height: 600 },
    user: '',
    quickTags:[
      {
        name: "PDF",
        colour:"is-danger",
        val: "Reinstalled PDF driver"
      }
    ]
  }
});
const isDevelopment = process.env.NODE_ENV !== 'production';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
function createWindow() {
  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
  // Pass those values in to the BrowserWindow options
  let { width, height } = write.get('bounds');
  win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true
  }
  });
  
  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
  // Open the DevTools.
  //win.webContents.openDevTools()
  //win.setMenu(null);
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let {
      width,
      height
    } = win.getBounds();
    write.set('bounds', {width , height});
  });
}
app.on('ready', () => {
  createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})