import { ipcMain } from 'electron';

export function setupIpc() {
  ipcMain.handle('app:getVersion', () => '0.1.0');
}
