# Global Translator Desktop Application

A native Windows desktop application powered by Electron, wrapping the Global Translator Angular frontend.

## Features

- 🖥️ **Native Windows Application** - Full desktop experience with system tray integration
- 🔄 **Auto-Updates** - Automatic updates when new versions are released
- 📁 **Native File Dialogs** - Use Windows native file pickers for video selection
- 🔒 **Secure** - Context isolation and sandbox enabled for security
- 🌙 **Dark Theme** - Modern dark theme matching the web application

## Development

### Prerequisites

1. Node.js 18+ installed
2. Frontend built (or running dev server)

### Quick Start

```bash
# Install dependencies
npm install

# Run in development mode (connects to local Angular dev server)
npm run dev

# Run in development mode (builds frontend first)
npm start
```

### Building for Distribution

```bash
# Build frontend and package for Windows
npm run build:win

# Build for all platforms
npm run build

# Create unpacked directory (for testing)
npm run pack
```

## Project Structure

```
desktop/
├── main.js          # Electron main process
├── preload.js       # Secure IPC bridge
├── package.json     # Dependencies and build config
├── icons/
│   ├── icon.ico     # Windows icon
│   ├── icon.png     # PNG icon
│   └── icon.icns    # macOS icon
└── dist/            # Built application output
```

## IPC API

The desktop app exposes the following APIs to the Angular frontend:

```javascript
// Check if running in Electron
if (window.electronAPI) {
  // Get API base URL
  const apiUrl = await window.electronAPI.getApiUrl();
  
  // Get app version
  const version = await window.electronAPI.getAppVersion();
  
  // Open file dialog
  const result = await window.electronAPI.openFileDialog();
  if (!result.canceled) {
    const filePath = result.filePaths[0];
  }
  
  // Listen for menu events
  window.electronAPI.onMenuUpload(() => {
    // Handle upload menu click
  });
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API URL | `http://localhost:8080` |

### Build Targets

- **Windows**: NSIS installer (.exe) and portable (.exe)
- **macOS**: DMG and ZIP
- **Linux**: AppImage and DEB

## Auto-Updates

The application supports auto-updates via GitHub Releases. Update the `publish` section in `package.json` with your repository details:

```json
"publish": {
  "provider": "github",
  "owner": "your-org",
  "repo": "global-translator"
}
```

## Troubleshooting

### White screen on startup
- Ensure the frontend is built: `npm run build:frontend`
- Check console for errors: View > Toggle Developer Tools

### Cannot connect to API
- Verify the backend is running on the expected port
- Check the `API_BASE_URL` environment variable

### Build fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure all dependencies are installed: `npm run postinstall`
