const path = require ('path')
const { app, BrowserWindow } = require('electron');
const { contextIsolated } = require('process');

function createWindow() {
const win = new BrowserWindow({
        width: 900,
        height: 675,
        resizable: false,
        useContentSize: true, 
        transparent: true,
        frame:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolated: false,
        }
    });

    win.loadFile(path.join(__dirname, '../canvas/index.html'));
    win.setMenu(null);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});