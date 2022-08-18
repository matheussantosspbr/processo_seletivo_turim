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

campoJSON.innerHTML = JSON.stringify(jsonPessoas, ['pessoas'], 4)

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
  criarDiv(li, 'inputsPessoa', inputTexto.value)

  // chamando a função de adiçionar pessoas no JSON
  adicionarPessoaJSON(inputTexto.value)
  // Renderizar no TEXTAREA
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)

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

  addButClose(div, nome)
  addButFil(div)
}

// Criar botão de Excluir Pessoa
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
  var i = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == e)
  jsonPessoas['pessoas'].splice(i, 1)
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

    var pai = li.parentElement['childNodes'][0].data

    var i = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == pai)

    jsonPessoas['pessoas'][i].filhos.push(filho)

    campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)

    addFilho(filho, pai)
  })
}

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

function criarDivFilho(li, c, nome, p) {
  let div = document.createElement('div')
  div.classList.add(c)

  li.appendChild(div)

  addButCloseFilho(div, nome, p)
}

function addButCloseFilho(div, nome, p) {
  let but = document.createElement('button')
  let txt = document.createTextNode('Remover Filho')

  let str = nome.replace(/\s/g, '')

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

function removerfilhoDoJson(f, p) {
  var pai = jsonPessoas['pessoas'].findIndex(pes => pes.pessoa == p)
  console.log(pai)
  let filho = jsonPessoas['pessoas'][pai].filhos.indexOf(f)
  console.log(filho)

  jsonPessoas['pessoas'][pai].filhos.splice(filho, 1)
  campoJSON.innerHTML = JSON.stringify(jsonPessoas, '', 4)
}
