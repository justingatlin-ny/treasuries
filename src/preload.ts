// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from "electron";
import {SavedLadderPayload} from "./types";

// window.electronAPI.getBills() is available in browser
contextBridge.exposeInMainWorld("electronAPI", {
  getBills: () => ipcRenderer.invoke("get-bills"),
  createInvite: (ladder: SavedLadderPayload) =>
    ipcRenderer.invoke("create-invite", ladder),
});
