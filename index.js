const electron = require('electron')
// Module to control application life
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const { ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const { Menu, MenuItem } = require('electron')

const windowProps = {
    height: 600,
    width: 1024,
    webPreferences: { experimentalFeatures: true }
}

// Keep a global reference of the windows objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let fileWindow = null
let libWindow = null

function openMainWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow(windowProps)

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    
    }))
    
    if (fileWindow) { fileWindow.close() }

    // Open the DevTools. todo: comment this line on releases
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    })
}

function openApp () {
    openMainWindow()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', openApp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null && libWindow === null && fileWindow === null) {
    openApp()
    }
})

function closeAllWindowsBut (windowToOpen) {
    for (let w of [mainWindow, fileWindow, libWindow]) {
    if (w !== null && w !== windowToOpen) w.close()
    }
}

function openFileWindow (filePath, libPath) {
    filePath = filePath === undefined ? 'examples/teste.xml' : filePath
    let musicFile = fs.readFileSync(filePath, 'utf-8')
    // Create the browser window.
    fileWindow = new BrowserWindow(windowProps)

    fileWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'score_stuff/index.html'),
    protocol: 'file:',
    slashes: true
    }))
    closeAllWindowsBut(fileWindow)

    fileWindow.on('closed', function () {
    fileWindow = null
    })

    ipcMain.removeAllListeners('back-to-lib-window')
    ipcMain.on('back-to-lib-window', (event, arg) => {
    event.sender.send('back-to-lib-window-reply', libPath)
    })
    ipcMain.removeAllListeners('read-file')
    ipcMain.on('read-file', (event, arg) => {
    event.sender.send('read-file-reply', {
        'filePath': filePath,
        'fileData': musicFile
    })
    })
}

function openLibWindow (libPath) {
    // Create the browser window.
    libWindow = new BrowserWindow(windowProps)

    libWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'lib_screen/index.html'),
    protocol: 'file:',
    slashes: true
    }))
    closeAllWindowsBut(libWindow)

    libWindow.on('closed', function () {
    libWindow = null
    })
    ipcMain.removeAllListeners('read-lib')
    ipcMain.on('read-lib', (event, arg) => {
    event.sender.send('read-lib-reply', libPath)
    })
}

// message events to windows
// reference examples: https://github.com/electron/electron/blob/master/docs/api/ipc-main.md
ipcMain.on('open-file', function (ev, arg) {
    openFileWindow(arg.path, arg.libPath)
})

ipcMain.on('open-main-window', function (ev, arg) {
    openMainWindow()
})

ipcMain.on('open-lib', function (ev, arg) {
    openLibWindow(arg)
})
