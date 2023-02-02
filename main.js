const {app, BrowserWindow, ipcMain} = require('electron')
var fs = require('fs')

var config = fs.readFileSync('./config.json')
config = JSON.parse(config)

const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile('index.html')
    // win.setMenu(null)
    // win.setFullScreen(true)
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {app.quit()})
