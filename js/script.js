// ===== Café Byte: script =====                                                                                                                                                                                        

// ----- Saudacao e "aberto agora" -----
console.log('O script do Café Byte foi carregado!');

const agora = new Date();
const hora = agora.getHours();      // de 0 a 23
const diaDaSemana = agora.getDay(); // 0 = domingo, 6 = sábado

console.log('Agora são ' + hora + ' horas. Dia da semana: ' + diaDaSemana);

function saudacao(h){
  if (h < 12){
    return 'Bom dia! ☀️';
  } else if (h < 18){
    return 'Boa tarde! ⛅';
  } else {
     return 'Boa noite! 🌙';
  }
}
 
 document.querySelector('#saudacao').textContent = saudacao(hora);
 
 function estaAberto(dia, h){
   if (dia === 0){
     return false;
   } else if (dia === 6){
     return h >= 8 && h < 18;
   } else {
     return h >= 7 && h < 20;
   }
} 

const avisoStatus = document.querySelector('#status');

if (estaAberto(diaDaSemana, hora)){
  avisoStatus.textContent = '🟢 Estamos abertos agora!';
  avisoStatus.classList.add('aberto-agora');
} else {
  avisoStatus.textContent = '🔴 Estamos fechados agora!';
  avisoStatus.classList.add('fechado-agora');
}

// ----- Modo escuro -----
const botaoTema = document.querySelector('#botao-tema');

function atualizarIconeTema(){
  if (document.body.classList.contains('escuro')){
    botaoTema.textContent = '☀️';
  } else {
    botaoTema.textContent = '🌙'; 
  }
}

botaoTema.addEventListener('click', function () {
  document.body.classList.toggle('escuro');
  atualizarIconeTema();
  localStorage.setItem('cafebyte-tema', document.body.classList.contains('escuro'));
});
      
// ----- Menu do celular -----
const botaoMenu = document.querySelector('#botao-menu');
const menu = document.querySelector('#menu');
      
botaoMenu.addEventListener('click', function (){
  menu.classList.toggle('mostrar');
});
      
//  Clicou em um link do menu? Fecha o menu.
menu.addEventListener('click', function () {
    menu.classList.remove('mostrar');
});
      
// ----- Cardápio: os dados -----
const produtos = [
  { id: 1, nome: 'Café expresso', categoria: 'bebida', preco: 6.5,
    emoji: '☕', descricao: 'Curto, encorpado e cheiroso.' },
  { id: 2, nome: 'Cappuccino', categoria: 'bebida', preco: 9.9,
    emoji: '🥛', descricao: 'Café, leite vaporizado e canela.'},
  { id: 3, nome: 'Chocolate quente', categoria: 'bebida', preco: 11,
    emoji: '🍫', descricao: 'Cremoso, perfeito para dias frios.'},
  { id: 4, nome: 'Suco de laranja', categoria: 'bebida', preco: 8,
    emoji: '🍊', descricao: 'Natural e geladinho.'},
  { id: 5, nome: 'Bolo de cenoura', categoria: 'doce', preco: 8.5,
    emoji: '🍰', descricao: 'Com cobertura de chocolate.'},
  { id: 6, nome: 'Cookie', categoria: 'doce', preco: 6,
    emoji: '🍪', descricao: 'Gotas de chocolate e casquinha crocante.'},
  { id: 7, nome: 'Pão de queijo', categoria: 'salgado', preco: 5,
    emoji: '🧀', descricao: 'Quentinho, saído do forno.'},
  { id: 8, nome: 'Misto quente', categoria: 'salgado', preco: 12,
    emoji: '🥪', descricao : 'Pão de forma, queijo e presunto.'}
];

console.log('Produtos no cardápio: ' + produtos.length);

// ----- Cardápio: mostrar na página -----
const listaProdutos = document.querySelector('#lista-produtos');
const busca = document.querySelector('#busca');
const filtros = document.querySelectorAll('.filtro');
let categoriaAtual = 'todos';

function formatarPreco(valor){
  return 'R$' + valor.toFixed(2).replace('.', ',');
}

function mostrarProdutos() {
 const texto = busca.value.toLowerCase();
 let encontrados = 0;
 listaProdutos.innerHTML = '';
  
 produtos.forEach(function (produto){
   const daCategoria = categoriaAtual === 'todos' || produto.categoria === categoriaAtual;
   const combinaBusca = produto.nome.toLowerCase().includes(texto);
    
   if (daCategoria && combinaBusca) {
     const card = document.createElement('article');
     card.className = 'card';
     card.innerHTML = `
       <span class="emoji">${produto.emoji}</span>
       <h3>${produto.nome}</h3>
       <p>${produto.descricao}</p>
       <p class="preco">${formatarPreco(produto.preco)}</p>
       <button class="botao" data-id="${produto.id}">Adicionar</button>
       `;
       listaProdutos.appendChild(card);
       encontrados = encontrados + 1;
     }
  });
    
  if (encontrados === 0) {
    listaProdutos.innerHTML = '<p>Nenhum produto encontrado. 🙁</p>';
  }
} 
 
mostrarProdutos();
 
// Digitou na busca? Mostra de novo, já filtrando
busca.addEventListener('input',mostrarProdutos);  

// Clicou em um filtro? Troca a categoria e marca o botão
filtros.forEach(function (botao) {
  botao.addEventListener('click', function () {
    filtros.forEach(function (outro) {
        outro.classList.remove('ativo');
      });
      botao.classList.add('ativo');
      categoriaAtual = botao.dataset.categoria;
      mostrarProdutos();
    });
  });
  
// ----- Meu pedido: salvo no navegador -----
const itensPedido = document.querySelector('#itens-pedido');
const totalPedido = document.querySelector('#total');

// Lê o pedido salvo. Se ainda não existir, começa com uma lista vazia.        
let pedido = JSON.parse(localStorage.getItem('cafebyte-pedido')) || [];

function salvarPedido() {
  localStorage.setItem('cafebyte-pedido', JSON.stringify(pedido));
}

function mostrarPedido() {
  itensPedido.innerHTML = '';
  let total = 0;
  
  if (pedido.length === 0) {
    itensPedido.innerHTML = '<li>Seu pedido está vazio. Escolha algo no cardápio!</li>';
  }
  
  pedido.forEach(function (item, posicao) {
    const subtotal = item.preco * item.quantidade;
    total = total + subtotal;
    const li = document.createElement('li');
    li.innerHTML = `
    <span>${item.quantidade}x ${item.nome}</span>
    <span>${formatarPreco(subtotal)}</span>
    <button class="remover" data-posicao="${posicao}" aria-label="Tirar um">-</button>
    `;
   itensPedido.appendChild(li);
 });
 
 totalPedido.textContent = formatarPreco(total);
}

mostrarPedido();

function adicionarAoPedido(id) {
  const produto = produtos.find(function (p) {
    return p.id === id;
  });
  const itemExistente = pedido.find(function (item) {
    return item.id === id;
  });
  
  if (itemExistente) {
    itemExistente.quantidade = itemExistente.quantidade + 1;
  } else {
    pedido.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }
  
  salvarPedido();
  mostrarPedido();
}

// Um só "escutador" para todos os botões Adicionar
listaProdutos.addEventListener('click', function (evento) {
  const id = evento.target.dataset.id;
  if (id) {
    adicionarAoPedido(Number(id));
  }
});

// Botão "-": tira uma unidade, e o item todo quando chega a zero
itensPedido.addEventListener('click', function (evento) {
  const posicao = evento.target.dataset.posicao;
  if (posicao !== undefined) {
    const item = pedido[posicao];
    item.quantidade = item.quantidade - 1;
    if (item.quantidade === 0) {
      pedido.splice(posicao, 1);
    }
    salvarPedido();
    mostrarPedido();
  }
});

// ----- Finalizar o pedido -----
const formEntrega = document.querySelector('#form-entrega');
const msgPedido = document.querySelector('#msg-pedido');

formEntrega.addEventListener('submit', function (evento) {
  evento.preventDefault(); // não deixa a página recarregar
  
  if (pedido.length === 0) {
    msgPedido.textContent = 'Seu pedido está vazio. Escolha algo no cardápio!';
    return;
  }
  
  const endereco = document.querySelector('#endereco').value;
  const numero = document.querySelector('#numero').value;
  msgPedido.textContent = `✅ Pedido recebido! Total: ${totalPedido.textContent}. Vamos entregar em ${endereco}, nº ${numero}.`;
  
  pedido = [];
  salvarPedido();
  mostrarPedido();
  formEntrega.reset();
});

// Lembrar o tema escolhido na última visita
if (localStorage.getItem('cafebyte-tema') === 'true') {
  document.body.classList.add('escuro');
  atualizarIconeTema();
}

// ----- API 1: clima agora (Open-Meteo) -----
// Coordenadas de São Paulo. Troque pelas da sua cidade!
const LATITUDE = -18.9113;
const LONGITUDE = -48.2622;
const caixaClima = document.querySelector('#clima');

async function carregarClima() {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${LATITUDE}&longitude=${LONGITUDE}`
    + '&current=temperature_2m';
    
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const temperatura = Math.round(dados.current.temperature_2m);
    
    let sugestao = '';
    if (temperatura < 20) {
      sugestao = 'Friozinho!Que tal um chocolate quente? 🍫';
    } else if (temperatura < 27) {
      sugestao = 'Clima perfeito para um cappuccino. ☕';
    } else {
      sugestao = 'Calorão! Um suco de laranja geladinho cai bem. 🍊';
    }
    
    caixaClima.textContent = `🌡️ Agora faz ${temperatura}ºC por aqui. ${sugestao}`;
  } catch (erro) {
    caixaClima.textContent = 'Não foi possível consultar o clima agora. ';
    console.log(erro);
  }
}

carregarClima();

// ----- API 2: endereço pelo CEP (ViaCEP) -----
const campoCep = document.querySelector('#cep');
const campoEndereco = document.querySelector('#endereco');
const msgCep = document.querySelector('#msg-cep');

async function buscarCep() {
  const cep = campoCep.value.replace('-', '').trim();
  
  if (cep.length !== 8) {
    msgCep.textContent = 'O CEP precisa ter 8 números.';
    return;
  }
  
  msgCep.textContent = '⏳ Procurando o endereço...';
  
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();
    
    if (dados.erro) {
      msgCep.textContent = 'CEP não encontrado. Confira os números. ';
      return;
    }
    
    campoEndereco.value = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
    msgCep.textContent = '📍 Endereço encontrado! Agora digite o número.';
    document.querySelector('#numero').focus();
  } catch (erro) {
    msgCep.textContent = 'Não foi possível consultar o CEP. Verifique a internet.';
    console.log(erro);
  }
}

// Quando a pessoa termina de digitar o CEP e sai do campo
campoCep.addEventListener('change', buscarCep);

// ------ Rodapé: ano sempre atualizado -----
document.querySelector('#ano').textContent = new Date().getFullYear();                                                 
