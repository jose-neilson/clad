const limit = 4;
const { ipcRenderer, remote } = require("electron");
const $ = require("jquery");
const dialog = remote.dialog;
let page_num;

$(function () {
  showClientes();
  showPages();
});

async function findCliente(id) {
  const element = await ipcRenderer.invoke("findCliente", id);
  console.log(element);

  let html = `
    <ul>
      <li class="col1 center">${element.id}</li>
      <li class="col3 left">  ${element.nome}</li>
      <li class="col1 center">${element.cidade}</li>
      <li class="col2 center">${element.estado}</li>
      <li class="col2 left">${element.endereço}</li>
      <li class="col2 center">${element.cpf}</li>
      <li class='menu-action'>
        <button class="action"><i class="material-icons">visibility</i></button>
        <button onclick='clickEdit(${element.id})' class="action"><i class="material-icons">edit</i></button>
        <button onclick='clickDelete(${element.id})'class="action"><i class="material-icons">delete</i></button>
      </li>
    </ul>
  `;
  console.log(html);
  $("#list").html(html);
}

// *

async function showPages() {
  const result = await ipcRenderer.invoke("showClientes", {});

  let page_rows = result.count;
  page_num = Math.ceil(page_rows / limit);
  let pages = "";
  pages += `<li><button id="navegation-previous" class="action page-key"><i class="material-icons">keyboard_arrow_left</i></button></li>`;
  for (let index = 1; index <= page_num; index++) {
    pages += `<li><button id="${index}" class="page-key page-number" data-index="${index}">${index}</button></li>`;
  }
  pages += `<li><button id="navegation-next" class="action page-key"><i class="material-icons">keyboard_arrow_right</i></button></li>`;

  $("#button_pages").html(pages);
  $(`#1`).addClass("active");
}

// Mostrar os clientes na tabela

async function showClientes(offset) {
  try {
    var params = {
      offset: offset,
      limit: limit,
    };
    const result = await ipcRenderer.invoke("showClientes", params);
    console.log(result);
    let html = "";
    for (let index = 0; index < result.rows.length; index++) {
      const element = result.rows[index];
      html += `
        <ul>
          <li class="col1 center">${element.id}</li>
          <li class="col3 left">  ${element.nome}</li>
          <li class="col1 center">${element.cidade}</li>
          <li class="col1 center">${element.estado}</li>
          <li class="col2 left">${element.endereço}</li>
          <li class="col2 center">${element.cpf}</li>
          <li class='menu-action'>
            <button class="action"><i class="material-icons">visibility</i></button>
            <button onclick='clickEdit(${element.id})' class="action"><i class="material-icons">edit</i></button>
            <button onclick='clickDelete(${element.id})'class="action"><i class="material-icons">delete</i></button>
          </li>
        </ul>`;
    }
    $("#list").html(html);
  } catch (err) {
    console.log(err);
  }
}

//Atualizar a tabela

ipcRenderer.on("updateTable", (event, args) => {
  console.log("entrou no updateTable");
  showClientes();
  showPages();
});

//Botões de editar e excluir

function clickEdit(id) {
  ipcRenderer.invoke("createModal", id);
}

function clickDelete(id) {
  let excluir = dialog.showMessageBoxSync({
    title: "Excluir",
    buttons: ["Sim", "Não"],
    message: "Deseja excluir esse cliente?",
  });
  console.log(excluir);
  if (excluir == 0) {
    const result = ipcRenderer.invoke("deleteCliente", id);
    console.log(result);
    dialog.showMessageBox({
      title: "Excluir",
      buttons: ["Ok"],
      message: "Cliente excluído com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
  }
}

// Função de clicar na pagina

$(document).on("click", ".page-number", (event) => {
  let index = $(event.currentTarget).attr("data-index");
  $(".page-number").removeClass("active");
  $(`#${index}`).addClass("active");
  let offset = (index - 1) * limit;
  console.log(offset);
  showClientes(offset);
});

// Criar modal

$("#register").on("click", () => {
  ipcRenderer.invoke("createModal");
});

// Botão pesquisar

$("#find").on("click", () => {
  let id = $("#id").val();
  console.log(id);
  if (id) {
    findCliente(id);
  } else {
    showClientes();
    showPages();
  }
});

// Botões de navegação

$(document).on("click", "#navegation-previous", (event) => {
  let actualPage = parseInt($(".active").attr("data-index"));
  let index = actualPage - 1;
  if (index > 0) {
    console.log(`Entrou no if ${index}`);
    $(".page-number").removeClass("active");
    $(`#${index}`).addClass("active");
    let offset = (index - 1) * limit;
    showClientes(offset);
  } else {
    index = actualPage;
  }
});

$(document).on("click", "#navegation-next", (event) => {
  let actualPage = parseInt($(".active").attr("data-index"));
  let index = actualPage + 1;
  if (index <= page_num) {
    console.log(page_num);
    console.log(`Entrou no if ${index}`);
    $(".page-number").removeClass("active");
    $(`#${index}`).addClass("active");
    let offset = (index - 1) * limit;
    showClientes(offset);
  } else {
    index = actualPage;
  }
});
