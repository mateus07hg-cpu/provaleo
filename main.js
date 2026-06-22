const API_URL = 'https://6a31cf957bc5e1c612662e56.mockapi.io/materiais';

function validarRetirada(estoqueAtual, quantidade) {
  if (!quantidade || quantidade <= 0) return false;
  if (quantidade > estoqueAtual)      return false;
  return true;
}

let materiais  = [];
let termoBusca = '';

const inputNome      = document.getElementById('input-nome');
const inputQtd       = document.getElementById('input-quantidade');
const btnCadastrar   = document.getElementById('btn-cadastrar');
const listaMateriais = document.getElementById('lista-materiais');
const toast          = document.getElementById('toast');
const inputRetirada  = document.getElementById('input-retirada');
const inputBusca     = document.getElementById('input-busca');
const totalItens     = document.getElementById('total-itens');
const totalQtd       = document.getElementById('total-quantidade');

function showToast(msg, tipo = 'ok') {
  toast.textContent = msg;
  toast.className   = tipo;
  setTimeout(() => {
    toast.textContent = '';
    toast.className   = '';
  }, 3000);
}

function atualizarDashboard() {
  totalItens.textContent = materiais.length;
  const soma = materiais.reduce((acc, m) => acc + Number(m.quantidade), 0);
  totalQtd.textContent = soma;
}

function renderTabela() {
  const filtrados = materiais.filter(m =>
    m.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  if (filtrados.length === 0) {
    listaMateriais.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">
          ${termoBusca ? 'Nenhum material encontrado.' : 'Nenhum material cadastrado ainda.'}
        </td>
      </tr>`;
    return;
  }

  listaMateriais.innerHTML = filtrados.map(m => `
    <tr data-id="${m.id}">
      <td>${m.nome}</td>
      <td><span class="qty-badge">${m.quantidade}</span></td>
      <td class="actions">
        <button class="btn-baixar" data-id="${m.id}" data-qtd="${m.quantidade}">Baixar</button>
        <button class="btn-excluir" data-id="${m.id}">Excluir</button>
      </td>
    </tr>
  `).join('');
}

async function carregarMateriais() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    materiais = await res.json();
    renderTabela();
    atualizarDashboard();
  } catch (err) {
    listaMateriais.innerHTML = `
      <tr class="empty-row">
        <td colspan="3">⚠️ Erro ao carregar: ${err.message}</td>
      </tr>`;
    showToast('Falha ao conectar com a API.', 'err');
  }
}

btnCadastrar.addEventListener('click', async () => {
  const nome      = inputNome.value.trim();
  const quantidade = parseInt(inputQtd.value, 10);

  if (!nome)                    { showToast('Informe o nome do material.', 'err');    return; }
  if (!quantidade || quantidade <= 0) { showToast('Informe uma quantidade válida.', 'err'); return; }

  btnCadastrar.disabled     = true;
  btnCadastrar.textContent  = 'Cadastrando…';

  try {
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nome, quantidade })
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);

    const novo = await res.json();
    materiais.push(novo);
    renderTabela();
    atualizarDashboard();

    inputNome.value = '';
    inputQtd.value  = '';
    showToast(`"${novo.nome}" cadastrado com sucesso!`, 'ok');
  } catch (err) {
    showToast(`Falha ao cadastrar: ${err.message}`, 'err');
  } finally {
    btnCadastrar.disabled    = false;
    btnCadastrar.textContent = 'Cadastrar';
  }
});

listaMateriais.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('btn-baixar')) {
    const estoqueAtual = Number(e.target.dataset.qtd);
    const retirada     = parseInt(inputRetirada.value, 10);

    if (!retirada) {
      showToast('Informe a quantidade a retirar.', 'err');
      return;
    }

    if (!validarRetirada(estoqueAtual, retirada)) {
      showToast('Retirada inválida: valor maior que o estoque ou inválido.', 'err');
      return;
    }

    const novaQtd = estoqueAtual - retirada;
    e.target.disabled = true;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ quantidade: novaQtd })
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);

      const atualizado = await res.json();
      materiais = materiais.map(m =>
        m.id === id ? { ...m, quantidade: atualizado.quantidade } : m
      );
      renderTabela();
      atualizarDashboard();
      inputRetirada.value = '';
      showToast(`Baixa de ${retirada} unidade(s) registrada.`, 'ok');
    } catch (err) {
      showToast(`Falha ao registrar baixa: ${err.message}`, 'err');
      e.target.disabled = false;
    }
  }

  if (e.target.classList.contains('btn-excluir')) {
    if (!confirm('Deseja excluir este material?')) return;
    e.target.disabled = true;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Erro ${res.status}`);

      materiais = materiais.filter(m => m.id !== id);
      renderTabela();
      atualizarDashboard();
      showToast('Material excluído.', 'ok');
    } catch (err) {
      showToast(`Falha ao excluir: ${err.message}`, 'err');
      e.target.disabled = false;
    }
  }
});

inputBusca.addEventListener('input', (e) => {
  termoBusca = e.target.value;
  renderTabela();
});

carregarMateriais();