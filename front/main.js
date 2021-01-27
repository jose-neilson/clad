require("dotenv/config");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios").default;
const BASE_URL = "http://localhost:3000";
const ROUTE = process.env.ROUTE;

console.log(process.env.ENVIRONMENT);

let winPrincipal;
function createWindow() {
  winPrincipal = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  winPrincipal.maximize();
  winPrincipal.loadFile(path.join(__dirname, "src/index.html"));
  winPrincipal.show();
  if (process.env.ENVIRONMENT == "development") {
    console.log("Entrou no if de development");
    winPrincipal.webContents.toggleDevTools();
  }
}

app.whenReady().then(createWindow);

// Funções de crud

ipcMain.handle("showClientes", async (event, params) => {
  const result = await axios.get(`${BASE_URL}${ROUTE}`, { params });
  return result.data;
});

ipcMain.handle("findCliente", async (event, id) => {
  const result = await axios.get(`${BASE_URL}${ROUTE}${id}`);
  return result.data;
});

ipcMain.handle("createCliente", async (event, nome, cidade, estado, endereço, cpf) => {
  const result = await axios.post(`${BASE_URL}${ROUTE}`, { nome, cidade, estado, endereço, cpf });
  return result.data;
});

ipcMain.handle("updateCliente", async (event, id_user, nome, cidade, estado, endereço, cpf) => {
  const result = await axios.put(`${BASE_URL}${ROUTE}${id_user}`, { nome, cidade, estado, endereço, cpf });
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

// ipcMain.handle("createModal", async (event, id) => {
//   let win = new BrowserWindow({
//     width: 800,
//     height: 500,
//     frame: false,
//     blur: true,
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: true,
//     },
//   });
//   var theUrl = "file://" + __dirname + "/src/modal.html";
//   win.loadURL(theUrl);
//   console.log(id);
// });

ipcMain.handle("createModal", async (event, id) => {
  let win = new BrowserWindow({
    width: 800,
    height: 400,
    skipTaskbar: true,
    frame: false,
    useContentSize: true,
    parent: winPrincipal,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    id_user: id,
  });
  var theUrl = "file://" + __dirname + "/src/modal.html";
  win.loadURL(theUrl);
  console.log(id);
  if (process.env.ENVIRONMENT == "development") {
    win.webContents.openDevTools();
  }
});
