let cancelar = document.querySelector("#cancelar");
let salvar = document.querySelector("#salvar");
const { remote, ipcRenderer } = require("electron");
let modal = remote.getCurrentWindow();
let window_id_user = modal.webContents.browserWindowOptions.id_user;

if (window_id_user) {
  findUser(window_id_user);
}

cancelar.addEventListener("click", () => {
  modal.close();
});

salvar.addEventListener("click", () => {
  if (window_id_user) {
    updateUsers(window_id_user);
  } else {
    createUsers();
  }
});

async function createUsers() {
  try {
    let name_user = document.querySelector("#name").value;
    let telephone = document.querySelector("#telephone").value;
    let email = document.querySelector("#email").value;
    const result = await ipcRenderer.invoke("createUsers", name_user, telephone, email);
    console.log(result);
    modal.close();
    alert("Usuário cadastrado com sucesso");
  } catch (err) {
    console.log(err);
  }
}

async function updateUsers(id_user) {
  try {
    console.log(id_user);
    let name_user = document.querySelector("#name").value;
    let telephone = document.querySelector("#telephone").value;
    let email = document.querySelector("#email").value;
    const cadastrar = await ipcRenderer.invoke("updateUsers", id_user, name_user, telephone, email);
    console.log(cadastrar);
    modal.close();
    alert("Usuário atualizado com sucesso");
  } catch (err) {
    console.log(err);
  }
}

async function findUser(id_user) {
  try {
    let name_user = document.querySelector("#name");
    let telephone = document.querySelector("#telephone");
    let email = document.querySelector("#email");
    const result = await ipcRenderer.invoke("findUser", id_user);
    console.log(result);
    name_user.value = result.name;
    telephone.value = result.telephone;
    email.value = result.email;
  } catch (err) {
    console.log(err);
  }
}
