require("dotenv/config");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios").default;
const BASE_URL = "http://localhost:3000";
const ROUTE = process.env.ROUTE;

let winPrincipal;

function createWindow() {
  winPrincipal = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  // winPrincipal.maximize();
  winPrincipal.loadFile(path.join(__dirname, "src/index.html"));
  winPrincipal.show();
  if (process.env.ENVIRONMENT == "development") {
    winPrincipal.webContents.toggleDevTools();
  }
}

app.whenReady().then(createWindow);

// Funções de crud

ipcMain.handle("indexClientes", async (event, params) => {
  const result = await axios.get(`${BASE_URL}${ROUTE}`, { params });
  return result.data;
});

ipcMain.handle("showCliente", async (event, id) => {
  const result = await axios.get(`${BASE_URL}${ROUTE}${id}`);
  return result.data;
});

ipcMain.handle("createCliente", async (event, data) => {
  console.log(data);
  const result = await axios.post(`${BASE_URL}${ROUTE}`, { data });
  return result.data;
});

ipcMain.handle("updateCliente", async (event, id_user, data) => {
  const result = await axios.put(`${BASE_URL}${ROUTE}${id_user}`, { data });
  return result.data;
});

ipcMain.handle("deleteCliente", async (event, id) => {
  const result = await axios.delete(`${BASE_URL}${ROUTE}${id}`);
  return result.data;
});

// Função de atualizar tabela

ipcMain.on("updateTableModal", (event, args) => {
  winPrincipal.webContents.send("updateTable", args);
});
