/**
 * Global Translator Desktop Application
 * Electron Main Process
 * 
 * This wraps the Angular frontend in a native Windows application
 * with system tray integration and auto-update support.
 */

const { app, BrowserWindow, Menu, Tray, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Keep reference to prevent garbage collection
let mainWindow = null;
let tray = null;

// Check if running in development mode
const isDev = process.argv.includes('--dev') || !app.isPackaged;

// API Base URL - can be configured based on environment
const API_BASE_URL = isDev
    ? 'http://localhost:8080'
    : process.env.API_BASE_URL || 'http://localhost:8080';

/**
 * Create the main application window
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        title: 'Global Translator',
        icon: path.join(__dirname, 'icons', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            sandbox: true
        },
        show: false, // Show when ready to prevent flash
        backgroundColor: '#1a1a2e', // Dark theme background
        autoHideMenuBar: true
    });

    // Load the Angular app
    if (isDev) {
        // Development: Load from Angular dev server
        mainWindow.loadURL('http://localhost:4201');
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load built Angular app
        mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        log.info('Main window ready');
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Handle window close - minimize to tray instead
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
        return true;
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

/**
 * Create system tray
 */
function createTray() {
    const iconPath = path.join(__dirname, 'icons', isDev ? 'icon.png' : 'icon.ico');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Global Translator',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Check for Updates',
            click: () => {
                autoUpdater.checkForUpdatesAndNotify();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Global Translator');
    tray.setContextMenu(contextMenu);

    // Double-click to open
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

/**
 * Create application menu
 */
function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Upload Video',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        mainWindow.webContents.send('menu-upload');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => {
                        mainWindow.webContents.send('menu-settings');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: () => {
                        app.isQuitting = true;
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                ...(isDev ? [
                    { type: 'separator' },
                    { role: 'toggleDevTools' }
                ] : [])
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => {
                        shell.openExternal('https://github.com/your-org/global-translator');
                    }
                },
                {
                    label: 'Check for Updates',
                    click: () => {
                        autoUpdater.checkForUpdatesAndNotify();
                    }
                },
                { type: 'separator' },
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About Global Translator',
                            message: 'Global Translator',
                            detail: `Version: ${app.getVersion()}\n\nA powerful video dubbing and translation platform.\n\n© 2024 Global Translator Team`
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

/**
 * Setup auto-updater
 */
function setupAutoUpdater() {
    autoUpdater.on('checking-for-update', () => {
        log.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('Update available:', info);
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Available',
            message: `A new version (${info.version}) is available. It will be downloaded in the background.`
        });
    });

    autoUpdater.on('update-not-available', () => {
        log.info('Update not available');
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info('Update downloaded:', info);
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Ready',
            message: 'A new update has been downloaded. Restart the application to apply the update.',
            buttons: ['Restart Now', 'Later']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.on('error', (err) => {
        log.error('Auto-updater error:', err);
    });
}

/**
 * IPC Handlers
 */
function setupIPC() {
    // Get API base URL
    ipcMain.handle('get-api-url', () => {
        return API_BASE_URL;
    });

    // Get app version
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    // Open file dialog for video selection
    ipcMain.handle('open-file-dialog', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [
                { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        return result;
    });

    // Save file dialog
    ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
        const result = await dialog.showSaveDialog(mainWindow, {
            defaultPath: defaultPath,
            filters: [
                { name: 'Video Files', extensions: ['mp4'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        return result;
    });
}

// ========================================
// App Lifecycle
// ========================================

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        log.info('App starting...');

        createMainWindow();
        createTray();
        createMenu();
        setupIPC();

        if (!isDev) {
            setupAutoUpdater();
            // Check for updates on startup
            setTimeout(() => {
                autoUpdater.checkForUpdatesAndNotify();
            }, 3000);
        }
    });
}

app.on('window-all-closed', () => {
    // On macOS, keep app running in menu bar
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    } else if (mainWindow) {
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    app.isQuitting = true;
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log.error('Uncaught exception:', error);
});
