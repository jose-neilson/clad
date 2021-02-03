const limit = 10;
const { default: axios } = require("axios");
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

// Botão pesquisar

$("#find").on("click", () => {
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
  $(".page-number").removeClass("btn-active");
  $(".page-number").removeClass("actual-page");
  $(`#num_pagination${pagina}`).addClass("btn-active");
  $(`#num_pagination${pagina}`).addClass("actual-page");
}

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

// Função de clicar no número da pagina

$(document).on("click", ".page-number", (event) => {
  let index = $(event.currentTarget).attr("data-index");
  searchValues(chave, value, index, ativo);
});

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
          <li class="col1 center">${element.estado}</li>
          <li class="col3 center">${element.cidade}</li>
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

//Atualizar a tabela

ipcRenderer.on("updateTable", (event, args) => {
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

//Botões de editar e excluir

$(document).on("click", ".edit", async (event) => {
  let id = $(event.currentTarget).attr("data-id");
  let dados = await searchCliente(id);
  showCliente(dados);

  let id_uf = await indexEstados(dados.estado);
  indexCidades(id_uf, dados.cidade);
  $(".content").removeClass("content-in");
  $(".modal").removeClass("modal-out");
  $(".content").addClass("content-out");
  $(".modal").addClass("modal-in");
});

$(document).on("click", ".delete", async (event) => {
  let id = $(event.currentTarget).attr("data-id");
  console.log(id);
  let excluir = dialog.showMessageBoxSync({
    title: "Excluir",
    buttons: ["Sim", "Não"],
    message: "Deseja excluir esse cliente?",
  });
  console.log(excluir);
  if (excluir == 0) {
    const result = ipcRenderer.invoke("deleteCliente", id);
    dialog.showMessageBoxSync({
      title: "Excluir",
      buttons: ["Ok"],
      message: "Cliente excluído com sucesso",
    });
    ipcRenderer.send("updateTableModal", {});
  }
});

// Botões de ativo e desativo

$(".btn-tab").on("click", (event) => {
  $(".btn-tab").removeClass("btn-active");
  $(event.currentTarget).addClass("btn-active");
  $(event.currentTarget).addClass("tab-active");
  ativo = $(event.currentTarget).attr("data-active");
  chave = $("#selection option:selected").val();
  value = $("#search_value").val();
  searchValues(chave, value, 1, ativo);
});

// Criar modal

$("#register").on("click", async () => {
  $(".content").removeClass("content-in");
  $(".content").addClass("content-out");
  $(".modal").removeClass("modal-out");
  $(".modal").addClass("modal-in");

  $("#id_user").val("");
  $("#nome").val("");
  $("#endereço").val("");
  $("#cpf").val("");

  let uf = await indexEstados();
  indexCidades(uf);
});

//Funções do modal

$("#cancelar").on("click", () => {
  $(".content").removeClass("content-out");
  $(".content").addClass("content-in");
  $(".modal").removeClass("modal-in");
  $(".modal").addClass("modal-out");
  // window.setTimeout(() => {
  //   $(".content").removeClass("hide");
  //   $(".content").addClass("active");
  //   $(".modal").addClass("hide");
  //   $(".modal").removeClass("active");
  // }, 300);
});

$("#salvar").on("click", () => {
  let id = $("#id_user").val();
  if (id) {
    updateCliente(id);
  } else {
    createCliente();
  }
  $(".content").removeClass("content-out");
  $(".content").addClass("content-in");
  $(".modal").removeClass("modal-in");
  $(".modal").addClass("modal-out");
});

//função do select do estado

$("#estado").on("change", (event) => {
  let uf = $("#estado option:selected").attr("data-uf");
  indexCidades(uf);
});

//funções de criar e atualizar

async function createCliente() {
  try {
    let nome = $("#nome").val();
    let cidade = $("#cidade").val();
    let estado = $("#estado").val();
    let endereço = $("#endereço").val();
    let cpf = $("#cpf").val();
    let ativo = $("#ativo").val();
    let data = {
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
  } catch (err) {
    console.log(err);
  }
}

async function updateCliente() {
  try {
    let id_user = $("#id_user").val();
    let nome = $("#nome").val();
    let estado = $("#estado").val();
    let cidade = $("#cidade").val();
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
  } catch (err) {
    console.log(err);
  }
}

//buscar o cliente pelo id

async function searchCliente(id_user) {
  try {
    const result = await ipcRenderer.invoke("showCliente", id_user);
    return result;
  } catch (err) {
    console.log(err);
  }
}

//coloca os dados nos campos

async function showCliente(dados) {
  $("#id_user").val(dados.id);
  $("#nome").val(dados.nome);
  $("#endereço").val(dados.endereço);
  $("#cpf").val(dados.cpf);
  $("#ativo").val(`${dados.ativo}`);
}

//procura os estados e seleciona(o estado) caso passe no parametro

async function indexEstados(estado) {
  let result = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
  let estados = result.data;
  let lista = "";
  for (let index = 0; index < estados.length; index++) {
    const uf = estados[index];
    lista += `<option data-uf="${uf.id}" value="${uf.sigla}">${uf.nome}</option>`;
  }
  $("#estado").html(lista);
  if (estado) $("#estado").val(estado);
  return $("#estado option:selected").attr("data-uf");
}

//procura as cidades passando o UF e seleciona(a cidade) caso passe no parametro

async function indexCidades(id_uf, cidade) {
  let result = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id_uf}/municipios`);
  let cidades = result.data;
  let lista = "";
  for (let index = 0; index < cidades.length; index++) {
    const cidade = cidades[index];
    lista += `<option data-cidade="${cidade.id}" value="${cidade.nome}">${cidade.nome}</option>`;
  }

  $("#cidade").html(lista);
  if (cidade) {
    $("#cidade").val(cidade);
  }
}
