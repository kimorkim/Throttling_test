const electron = require('electron');
const {app, BrowserWindow, Menu, globalShortcut, ipcMain} = electron;
const path = require('path');
var mainWindow;
var subWindow = [];

app.once('ready', function() {
  
    mainWindow = new BrowserWindow({
        width: 1024, 
        height: 700,
        webPreferences: {
            backgroundThrottling: false
        }
    });

    mainWindow.setMenu(null);

    mainWindow.loadURL('file:///' + path.join(__dirname, 'src', 'main.html'));

    mainWindow.webContents.openDevTools();
});

ipcMain.on('command', function (e, arg) {
    switch(arg) {
        case 'reload': 
            e.sender.reload();
            break;
        case 'child1':
        case 'child2':
            if(!subWindow[arg]) {
                subWindow[arg] = new BrowserWindow({
                    width: 512, 
                    height: 350,
                    title: arg,
                    webPreferences: {
                        backgroundThrottling: false
                    }
                });
                subWindow[arg].name = arg;
                subWindow[arg].setMenu(null);
                subWindow[arg].loadURL('file:///' + path.join(__dirname, 'src', 'sub.html'));
                subWindow[arg].show();
            } else {
                if (subWindow[arg].isMinimized()) {
                    subWindow[arg].restore();
                }
                subWindow[arg].focus();
            }
            break;
    }
});

ipcMain.on('message', function (e, msg) {
    var id = e.sender.browserWindowOptions.title;
    mainWindow.send('message', {
        id: id,
        msg: msg
    });
});
