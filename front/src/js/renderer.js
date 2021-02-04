const limit = 10;
const { default: axios } = require("axios");
const { ipcRenderer, remote } = require("electron");
const $ = require("jquery");
require("jquery-mask-plugin");

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

// Função de mostrar os dados na tabela

function indexClientes(result) {
  try {
    let html = "";
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      html += `
        <ul>
        <li class="col1 center">${element.id}</li>
        <li class="col3 left truncate">${element.nome}</li>
        <li class="col2 center">${element.cpf}</li>
        <li class="col3 left">${element.data_nasc}</li>
        <li class="col1 center">${element.cep}</li>
        <li class="col1 center">${element.uf}</li>
        <li class="col2 center truncate">${element.cidade}</li>
        <li class="col2 center">${element.bairro}</li>
        <li class="col2 left">${element.endereço}</li>
          <li class='menu-action'>
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

  let id_uf = await indexEstados(dados.uf);
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

  let cpf = $("#cpf");
  let cep = $("#cep");

  cpf.mask("000.000.000-00");
  cep.mask("00000-000");
  cpf.val("");
  cep.val("");
  $("#id_user").val("");
  $("#nome").val("");
  $("#data-nasc").val("");
  $("#bairro").val("");
  $("#endereço").val("");

  let cod_uf = await indexEstados();
  indexCidades(cod_uf);
});

//Funções do modal

$("#cancelar").on("click", () => {
  $(".content").removeClass("content-out");
  $(".content").addClass("content-in");
  $(".modal").removeClass("modal-in");
  $(".modal").addClass("modal-out");
});

$("#salvar").on("click", () => {
  let data = getCampos();
  let campos = Object.values(data);
  for (let index = 0; index < campos.length; index++) {
    const element = campos[index];
    if (element == "") {
      return alert("Algum dos campos está vazio");
    }
  }

  let id = $("#id_user").val();
  if (id) {
    updateCliente(id, data);
  } else {
    createCliente(data);
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

$("#cep").on("blur", async (event) => {
  let cep = $("#cep").cleanVal();
  if (cep != "") {
    const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const element = result.data;
    if (!("erro" in element)) {
      console.log(element);
      $("#bairro").val(element.bairro);
      let uf = await indexEstados(element.uf);
      indexCidades(uf, element.localidade);
      $("#endereço").val(element.logradouro);
    } else {
      $("#cep").val("");
      $("#cidade").val("");
      $("#estado").val("");
      $("#bairro").val("");
      alert("CEP não encontrado");
      console.log("CEP não encontrado");
    }
  } else {
    console.log("CEP vazio");
  }
});

function getCampos() {
  let nome = $("#nome").val();
  let data_nasc = $("#data-nasc").val();
  let cidade = $("#cidade").val();
  let cep = $("#cep").cleanVal();
  let bairro = $("#bairro").val();
  let uf = $("#estado").val();
  let endereço = $("#endereço").val();
  let numero_rua = $("#numero_rua").val();
  let complemento = $("#complemento").val();
  let cpf = $("#cpf").cleanVal();
  let ativo = $("#ativo").val();
  let data = {
    nome,
    cpf,
    data_nasc,
    cep,
    uf,
    cidade,
    bairro,
    endereço,
    numero_rua,
    complemento,
    ativo,
  };
  return data;
}

//funções de criar e atualizar

async function createCliente(data) {
  try {
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

async function updateCliente(id, data) {
  try {
    const result = await ipcRenderer.invoke("updateCliente", parseInt(id), data);
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
  let cep = $("#cep");
  let cpf = $("#cpf");
  cpf.mask("000.000.000-00");
  cep.mask("00000-000");
  cpf.val(dados.cpf).trigger("input");
  cep.val(dados.cep).trigger("input");

  $("#id_user").val(dados.id);
  $("#nome").val(dados.nome);
  $("#data-nasc").val(dados.data_nasc);
  $("#bairro").val(dados.bairro);
  $("#endereço").val(dados.endereço);
  $("#numero_rua").val(dados.numero_rua);
  $("complemento").val(dados.complemento);
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
  if (estado) {
    $("#estado").val(estado);
  }
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
