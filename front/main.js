const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios").default;
const BASE_URL = "http://localhost:3000";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win.loadFile(path.join(__dirname, "src/index.html"));
}

app.whenReady().then(createWindow);

ipcMain.handle("showUsers", async (event, args) => {
  const result = await axios.get(`${BASE_URL}/users`);
  return result.data;
});

ipcMain.handle("findUser", async (event, id_user) => {
  const result = await axios.get(`${BASE_URL}/users/${id_user}`);
  return result.data;
});

ipcMain.handle("createUsers", async (event, name_user, telephone, email) => {
  const result = await axios.post(`${BASE_URL}/users`, {
    name: name_user,
    telephone: telephone,
    email: email,
  });
  return result.data;
});

ipcMain.handle("updateUsers", async (event, id_user, name_user, telephone, email) => {
  const result = await axios.put(`${BASE_URL}/users/${id_user}`, {
    name: name_user,
    telephone: telephone,
    email: email,
  });
  return result.data;
});

ipcMain.handle("deleteUsers", async (event, id_user) => {
  const result = await axios.delete(`${BASE_URL}/users/${id_user}`);
  return result.data;
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
    height: 500,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
    },
    id_user: id,
  });
  win.setBackgroundColor("#808080");
  var theUrl = "file://" + __dirname + "/src/modal.html";
  win.loadURL(theUrl);
  console.log(id);
});
