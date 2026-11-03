import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('profitLeak', {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
});
