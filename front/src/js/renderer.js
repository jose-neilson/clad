let lista = document.querySelector("#lista");
let cadastro = document.querySelector("#cadastro");
const { remote, ipcRenderer } = require("electron");
let mainWindow = remote.getCurrentWindow();

async function showUsers() {
  try {
    const result = await ipcRenderer.invoke("showUsers", "");
    console.log(result);
    let html = "";
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      html += `
    <tr>
      <td>${element.id}</td>
      <td>${element.name}</td>
      <td>${element.telephone}</td>
      <td>${element.email}</td>
      <td><button onclick='clickEdit(${element.id})' class='btn orange'>Editar</button>
      <button onclick='clickDelete(${element.id})' class='btn red'>Excluir</button></td>
    </tr>
    `;
      console.log(element);
    }
    lista.innerHTML = html;
  } catch (err) {
    console.log(err);
  }
}

showUsers();

mainWindow.addListener("focus", () => {
  showUsers();
});

function clickEdit(id) {
  ipcRenderer.invoke("createModal", id);
}

function clickDelete(id) {
  if (confirm("Deseja excluir esse usuário?")) {
    const result = ipcRenderer.invoke("deleteUsers", id);
    console.log(result);
    alert("Usuário deletado com sucesso");
  }
}

cadastro.addEventListener("click", () => {
  ipcRenderer.invoke("createModal");
});
