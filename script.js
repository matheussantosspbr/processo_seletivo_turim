// Variaveis
let inputTexto = document.querySelector('#inputTexto')
let butAddPess = document.querySelector('.incluir')
let contreinnerPessoas = document.querySelector('.contreinnerPessoas')
let filho = ''

/*====================== JSON =============================*/
let campoJSON = document.querySelector('#campoJSON')

// FORMATO JSON
let jsonPessoas = {
  pessoas: []
}

// Verifica se tem Algo na URL
if (window.location['search']) {
  //pega o que tem na URL removendo os caracteres ?json=
  let jsonUrl = window.location['search'].slice(6)

  // Tira todos os % e colocar aspas duplas
  jsonUrl = jsonUrl.replace(/%/gi, '"')

  // Tira todos os 2
  jsonUrl = jsonUrl.replace(/2/gi, '')
  console.log(jsonUrl)

  // Transformo o JSON String em Obgj
  jsonFormatado = JSON.parse(jsonUrl)

  //Transforma o JSON OBJ em String Formatada
  campoJSON.innerHTML = JSON.stringify(jsonFormatado, '', 4)

  for (let i = 0; i < jsonFormatado['pessoas'].length; i++) {
    adicionarPessoas(jsonFormatado['pessoas'][i].nome)
    for (let j = 0; j < jsonFormatado['pessoas'][i]['filhos'].length; j++) {
      adicionarFilhos(
        jsonFormatado['pessoas'][i].nome,
        jsonFormatado['pessoas'][i]['filhos'][j]
      )
    }
  }
} else {
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
}

/*====================== FIM JSON =============================*/

butAddPess.addEventListener('click', () => {
  // Criar LI
  let li = document.createElement('li')
  li.classList.add('liPessoa')
  // Injetar texto do input na LI
  let txt = document.createTextNode(inputTexto.value)

  li.appendChild(txt)
  contreinnerPessoas.appendChild(li)

  // adicionar a div de Filhos
  addDivFilhos(li)
  // criar div para os botões de ADD Filho e Remover pessoa
  criarDiv(li, 'inputsPessoa', inputTexto.value)

  // chamando a função de adiçionar pessoas no JSON
  adicionarPessoaJSON(inputTexto.value)
  // Renderizar no TEXTAREA
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
  // Esvaziar imput após clicado
  inputTexto.value = ''
})

//função para adicionar pessoa no JSON
function adicionarPessoaJSON(e) {
  let i = {
    pessoa: `${e}`,
    filhos: []
  }
  jsonPessoas.pessoas.push(i)
}

// Função para criar a div dos Botões de AddFilho e Remover Pessoa
function criarDiv(li, c, nome) {
  let div = document.createElement('div')
  div.classList.add(c)

  li.appendChild(div)
  // função para criar e adicionar botão de Remover Pessoa
  addButClose(div, nome)
  // função para criar e adicionar botão de Adicionar filho
  addButFil(div)
}

// Criar e adicionar botão de Excluir Pessoa
function addButClose(li, nome) {
  let but = document.createElement('button')
  let txt = document.createTextNode('Remover Pessoa')

  let str = nome.replace(/\s/g, '')

  but.className = 'but removerPessoa ' + str
  but.appendChild(txt)
  li.appendChild(but)

  but.addEventListener('click', () => {
    li.parentElement.style.display = 'none'

    // pegar class do botão da pessoa que foi removida para tirar do JSON
    let classesBut = procurarValorClass(nome)

    let classBut = pegarClasse(classesBut)
    // função para remover pessoa do JSON
    removerPessoaDoJson(classBut)
  })
}

// para pegar a class que está na 2 posição do Array ( que é o nome da pessoa )
function pegarClasse(i) {
  let classe = i[0].classList[2]
  return classe
}

// pegar class do botão da pessoa que foi removida para tirar do JSON
function procurarValorClass(n) {
  let str = n.replace(/\s/g, '')
  //pegar elemento que está com esta class
  let elementosTeste = document.getElementsByClassName(str)
  let divsTeste = Array.prototype.filter.call(
    elementosTeste,
    function (elementoTeste) {
      return elementoTeste.nodeName === 'BUTTON'
    }
  )
  return divsTeste
}

// Remover Pessoa do JSON
function removerPessoaDoJson(e) {
  // retorna em qual posição do array pessos o pai ( pessoa ) está
  var i = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == e)
  // remove a pessoa do JSON
  jsonPessoas['pessoas'].splice(i, 1)
  //renderiza na telo o JSON atual
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
}

// Criar contreinner de Filhos para cada pai ou mãe
function addDivFilhos(li) {
  let div = document.createElement('div')
  div.className = 'filhos'
  li.appendChild(div)
}

// Criar Botão de Adicionar Filho
function addButFil(li) {
  let but = document.createElement('button')
  let txt = document.createTextNode('Adicionar Filho')

  but.className = 'but addFilho'
  but.appendChild(txt)
  li.appendChild(but)

  but.addEventListener('click', () => {
    // Para abrir um prompt para escrever o nome do filho
    filho = window.prompt('Adicione um filho')
    // pega o nome do pai
    var pai = li.parentElement['childNodes'][0].data
    // procura onde está o pai dentro do array pessoas
    var i = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == pai)
    // adiciona o filho
    jsonPessoas['pessoas'][i].filhos.push(filho)
    //Renderiza o JSON na Tela
    campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
    // Função para adicionar o filho na tabela ( tela )
    addFilho(filho, pai)
  })
}
// Função para adicionar o filho na tabela ( tela )
function addFilho(f, p) {
  // Criar LI
  let div = document.createElement('p')
  div.classList.add('filho')
  // Injetar texto do input na LI
  let txt = document.createTextNode(f)
  div.appendChild(txt)
  document
    .querySelector('.' + p)
    .parentElement.parentElement.childNodes[1].appendChild(div)
  // adicionar a div de Filhos
  criarDivFilho(div, 'inputsFilhos', f, p)
}

// Criar div filho
function criarDivFilho(li, c, nome, p) {
  let div = document.createElement('div')
  div.classList.add(c)

  li.appendChild(div)
  // Função para criar o botão remover filho
  addButCloseFilho(div, nome, p)
}

// Função para Criar o botão de Remover Filho
function addButCloseFilho(div, nome, p) {
  let but = document.createElement('button')
  let txt = document.createTextNode('Remover Filho')

  //Tirar Todos os espaços
  let str = nome.replace(/\s/g, '')
  //criar class do botão remover filho
  but.className = 'but removerFilho ' + str
  but.appendChild(txt)
  div.appendChild(but)

  but.addEventListener('click', () => {
    div.parentElement.style.display = 'none'

    // pegar class do botão da pessoa que foi removida para tirar do JSON
    let classesBut = procurarValorClass(nome)

    let classBut = pegarClasse(classesBut)
    // função para remover pessoa do JSON
    removerfilhoDoJson(classBut, p)
  })
}

// Função para Remover filho do JSON
function removerfilhoDoJson(f, p) {
  var pai = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == p)
  console.log(pai)
  let filho = jsonPessoas['pessoas'][pai].filhos.indexOf(f)
  console.log(filho)

  jsonPessoas['pessoas'][pai].filhos.splice(filho, 1)
  //Renderizar na tela
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
}

function adicionarPessoas(pes) {
  // Criar LI
  let li = document.createElement('li')
  li.classList.add('liPessoa')
  // Injetar texto do input na LI
  let txt = document.createTextNode(pes)

  li.appendChild(txt)
  contreinnerPessoas.appendChild(li)

  // adicionar a div de Filhos
  addDivFilhos(li)
  criarDiv(li, 'inputsPessoa', pes)
}

function adicionarFilhos(pai, filho) {
  // Se o que tiver escrito dentro do elemento pai for igual a (?) execulte
  if (
    document.querySelector('.' + pai).parentElement.parentElement[
      'childNodes'
    ][0].data == pai
  ) {
    let contreinnerFilhos = document.querySelector('.' + pai).parentElement
      .parentElement['childNodes'][1]
    // Criar LI
    let p = document.createElement('p')
    p.classList.add('filho')
    // Injetar texto do input na LI
    let txt = document.createTextNode(filho)
    p.appendChild(txt)
    contreinnerFilhos.appendChild(p)
    // adicionar a div de Filhos
    criarDivFilho(p, 'inputsFilhos', filho, pai)
  } else {
    console.log(' Não encontrado')
  }
}
