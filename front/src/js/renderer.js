const limit = 10;
const { ipcRenderer, remote } = require("electron");
const $ = require("jquery");
const dialog = remote.dialog;
let page_num;
let chave;
let value;
let ativo = $(".tab-active").attr("data-active");

$(function () {
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

$(".btn-tab").on("click", (event) => {
  $(".btn-tab").removeClass("active");
  $(event.currentTarget).addClass("active");
  $(event.currentTarget).addClass("tab-active");
  ativo = $(event.currentTarget).attr("data-active");
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

// Função de buscar os dados no banco

async function searchValues(chave, value, pagina, ativo) {
  let params = {
    chave,
    value,
    pagina,
    limit,
    ativo,
  };
  const result = await ipcRenderer.invoke("indexClientes", params);
  indexClientes(result.rows);
  showPages(result.count, pagina);
}

// Função de fazer a paginação

function showPages(count, pagina) {
  let pages = "";
  page_num = Math.ceil(count / limit);

  for (let index = 1; index <= page_num; index++) {
    pages += `<button id="num_pagination${index}" class="page-key page-number" data-index="${index}">${index}</button>`;
  }

  $("#pagination-numbers").html(pages);
  $(".page-number").removeClass("active");
  $(".page-number").removeClass("actual-page");
  $(`#num_pagination${pagina}`).addClass("active");
  $(`#num_pagination${pagina}`).addClass("actual-page");
}

// Função de mostrar os dados na tabela

function indexClientes(result) {
  try {
    let html = "";
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
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
            <button data-id="${element.id}" class="action edit"><i class="material-icons">edit</i></button>
            <button data-id="${element.id}" class="action delete"><i class="material-icons">delete</i></button>
          </li>
        </ul>`;
    }
    $("#list").html(html);
  } catch (err) {
    console.log(err);
  }
}

//Botões de editar e excluir

$(document).on("click", ".edit", (event) => {
  let id = $(event.currentTarget).attr("data-id");
  ipcRenderer.invoke("createModal", id);
});

$(document).on("click", ".delete", (event) => {
  let id = $(event.currentTarget).attr("data-id");
  let excluir = dialog.showMessageBoxSync({
    title: "Excluir",
    buttons: ["Sim", "Não"],
    message: "Deseja excluir esse cliente?",
  });
  if (excluir == 0) {
    const result = ipcRenderer.invoke("deleteCliente", id);
    dialog.showMessageBox({
      title: "Excluir",
      buttons: ["Ok"],
      message: "Cliente excluído com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
  }
});

// Função de clicar no número da pagina

$(document).on("click", ".page-number", (event) => {
  let index = $(event.currentTarget).attr("data-index");
  searchValues(chave, value, index, ativo);
});

// Criar modal

$("#register").on("click", () => {
  ipcRenderer.invoke("createModal");
});

// Botão pesquisar

$("#find").on("click", () => {
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

// Botões de navegação

$(document).on("click", "#navegation-previous", (event) => {
  let actualPage = parseInt($(".actual-page").attr("data-index"));
  let index = actualPage - 1;
  if (index > 0) {
    chave = $("#selection option:selected").val();
    value = $("#search_value").val();
    searchValues(chave, value, index, ativo);
  } else {
    index = actualPage;
  }
});

$(document).on("click", "#navegation-next", (event) => {
  let actualPage = parseInt($(".actual-page").attr("data-index"));
  let num_pages = $(".page-number").length;
  console.log(num_pages);
  console.log(actualPage);
  let index = actualPage + 1;
  if (index <= num_pages) {
    chave = $("#selection option:selected").val();
    value = $("#search_value").val();
    searchValues(chave, value, index, ativo);
  } else {
    index = actualPage;
  }
});

//Atualizar a tabela

ipcRenderer.on("updateTable", (event, args) => {
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

// Botões de ativo e desativo
