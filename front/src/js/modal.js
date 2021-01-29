const { remote, ipcRenderer } = require("electron");
const dialog = remote.dialog;
const $ = require("jquery");

let modal = remote.getCurrentWindow();
let window_id_user = modal.webContents.browserWindowOptions.id_user;

if (window_id_user) {
  console.log(window_id_user);
  showCliente(window_id_user);
}

$("#cancelar").on("click", () => {
  modal.close();
});

$("#salvar").on("click", () => {
  if (window_id_user) {
    updateCliente(window_id_user);
  } else {
    createCliente();
  }
});

async function createCliente() {
  try {
    let nome = $("#nome").val();
    let cidade = $("#cidade").val();
    let estado = $("#estado").val();
    let endereço = $("#endereço").val();
    let cpf = $("#cpf").val();
    let ativo = $("#ativo").val();
    var data = {
      nome,
      cidade,
      estado,
      endereço,
      cpf,
      ativo,
    };
    const result = await ipcRenderer.invoke("createCliente", data);
    dialog.showMessageBox({
      buttons: ["Ok"],
      message: "Usuário criado com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
    modal.close();
  } catch (err) {
    console.log(err);
  }
}

async function updateCliente(id_user) {
  try {
    let nome = $("#nome").val();
    let cidade = $("#cidade").val();
    let estado = $("#estado").val();
    let endereço = $("#endereço").val();
    let cpf = $("#cpf").val();
    let ativo = $("#ativo").val();
    var data = {
      nome,
      cidade,
      estado,
      endereço,
      cpf,
      ativo,
    };
    const result = await ipcRenderer.invoke("updateCliente", parseInt(id_user), data);
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

async function showCliente(id_user) {
  try {
    const result = await ipcRenderer.invoke("showCliente", id_user);
    $("#nome").val(result.nome);
    $("#cidade").val(result.cidade);
    $("#estado").val(result.estado);
    $("#endereço").val(result.endereço);
    $("#cpf").val(result.cpf);
    $("#ativo").val(`${result.ativo}`);
  } catch (err) {
    console.log(err);
  }
}
