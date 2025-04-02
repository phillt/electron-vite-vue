import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

// Settings file management
const SETTINGS_FILE = path.join(os.homedir(), ".bdgtman");

interface AppSettings {
  lastBudgetPath: string | null;
}

async function loadSettings(): Promise<AppSettings> {
  try {
    console.log("Loading settings from:", SETTINGS_FILE);
    const content = await fs.readFile(SETTINGS_FILE, "utf-8");
    const settings = JSON.parse(content);
    console.log("Settings loaded:", settings);
    return settings;
  } catch (error) {
    console.log("No settings file found or invalid, creating default settings");
    // If file doesn't exist or is invalid, create default settings
    const defaultSettings: AppSettings = {
      lastBudgetPath: null,
    };
    await saveSettings(defaultSettings);
    return defaultSettings;
  }
}

async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    console.log("Saving settings to:", SETTINGS_FILE);
    console.log("Settings to save:", settings);
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log("Settings saved successfully");
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

// Handle settings IPC calls
ipcMain.handle("settings:get", async () => {
  console.log("Received settings:get request");
  const settings = await loadSettings();
  console.log("Returning settings:", settings);
  return settings;
});

ipcMain.handle("settings:set", async (_, settings: AppSettings) => {
  console.log("Received settings:set request with settings:", settings);
  await saveSettings(settings);
  console.log("Settings saved successfully");
});

async function createWindow() {
  win = new BrowserWindow({
    title: "Astreos",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    frame: false,
    titleBarStyle: "hidden",
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: true,
    width: 950,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  // Set up window controls
  ipcMain.on("window:minimize", () => {
    win?.minimize();
  });

  ipcMain.on("window:maximize", () => {
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on("window:close", () => {
    win?.close();
  });

  ipcMain.handle("window:isMaximized", () => {
    return win?.isMaximized();
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

// Handle dialog IPC calls
ipcMain.handle("dialog:showOpenDialog", async (_, options) => {
  if (!win) {
    throw new Error("Main window not available");
  }
  return dialog.showOpenDialog(win, options);
});

ipcMain.handle("dialog:showSaveDialog", async (_, options) => {
  if (!win) {
    throw new Error("Main window not available");
  }
  return dialog.showSaveDialog(win, options);
});

// Handle file operations
ipcMain.handle("file:save", async (_, { filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
});

ipcMain.handle("file:read", async (_, filePath) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

// Handle showing items in folder
ipcMain.handle("shell:showItemInFolder", async (_, filePath) => {
  try {
    shell.showItemInFolder(filePath);
    return true;
  } catch (error) {
    console.error("Error showing item in folder:", error);
    throw error;
  }
});
