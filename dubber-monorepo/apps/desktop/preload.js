/**
 * Preload Script for Global Translator Desktop
 * 
 * This script runs in the renderer process before the web page loads.
 * It provides a secure bridge between the web app and Electron's APIs.
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Get the API base URL from main process
    getApiUrl: () => ipcRenderer.invoke('get-api-url'),

    // Get application version
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    // Open native file dialog for video selection
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),

    // Open native save dialog
    saveFileDialog: (defaultPath) => ipcRenderer.invoke('save-file-dialog', defaultPath),

    // Listen for menu events
    onMenuUpload: (callback) => {
        ipcRenderer.on('menu-upload', callback);
        return () => ipcRenderer.removeListener('menu-upload', callback);
    },

    onMenuSettings: (callback) => {
        ipcRenderer.on('menu-settings', callback);
        return () => ipcRenderer.removeListener('menu-settings', callback);
    },

    // Platform detection
    platform: process.platform,

    // Check if running in Electron
    isElectron: true
});

// Log that preload is ready
console.log('Electron preload script loaded');
