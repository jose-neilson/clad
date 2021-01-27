let cancelar = document.querySelector("#cancelar");
let salvar = document.querySelector("#salvar");
const { remote, ipcRenderer } = require("electron");
const dialog = remote.dialog;
let modal = remote.getCurrentWindow();
let window_id_user = modal.webContents.browserWindowOptions.id_user;

if (window_id_user) {
  findCliente(window_id_user);
}

cancelar.addEventListener("click", () => {
  modal.close();
});

salvar.addEventListener("click", () => {
  if (window_id_user) {
    updateCliente(window_id_user);
  } else {
    createCliente();
  }
});

async function createCliente() {
  try {
    let nome = document.querySelector("#nome").value;
    let cidade = document.querySelector("#cidade").value;
    let estado = document.querySelector("#estado").value;
    let endereço = document.querySelector("#endereço").value;
    let cpf = document.querySelector("#cpf").value;
    const result = await ipcRenderer.invoke("createCliente", nome, cidade, estado, endereço, cpf);
    console.log(result);
    dialog.showMessageBox({
      buttons: ["Ok"],
      message: "Usuário atualizado com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
    modal.close();
  } catch (err) {
    console.log(err);
  }
}

async function updateCliente(id_user) {
  try {
    console.log(id_user);
    let nome = document.querySelector("#nome").value;
    let cidade = document.querySelector("#cidade").value;
    let estado = document.querySelector("#estado").value;
    let endereço = document.querySelector("#endereço").value;
    let cpf = document.querySelector("#cpf").value;
    const result = await ipcRenderer.invoke("updateCliente", id_user, nome, cidade, estado, endereço, cpf);
    console.log(result);
    dialog.showMessageBox({
      buttons: ["Ok"],
      message: "Usuário atualizado com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
    modal.close();
  } catch (err) {
    console.log(err);
  }
}

async function findCliente(id_user) {
  try {
    let nome = document.querySelector("#nome");
    let cidade = document.querySelector("#cidade");
    let estado = document.querySelector("#estado");
    let endereço = document.querySelector("#endereço");
    let cpf = document.querySelector("#cpf");
    const result = await ipcRenderer.invoke("findCliente", id_user);
    console.log(result);
    nome.value = result.nome;
    cidade.value = result.cidade;
    estado.value = result.estado;
    endereço.value = result.endereço;
    cpf.value = result.cpf;
  } catch (err) {
    console.log(err);
  }
}
