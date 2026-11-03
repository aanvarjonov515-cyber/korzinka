import { app, BrowserWindow } from 'electron';
import path from 'path';
import { setupIpc } from './ipc';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000');
  setupIpc();
}

app.whenReady().then(createWindow);
