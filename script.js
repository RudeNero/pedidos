// A inicialização do Firebase já está no HTML, então não precisamos mais disso aqui.
// Apenas use a variável 'database' que foi definida no HTML.

// Seleção de elementos do DOM
const addPedidoBtn = document.getElementById('add-pedido-btn');
const listaPedidos = document.getElementById('lista-pedidos');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-btn');
const formPedido = document.getElementById('form-pedido');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

// Array para armazenar os pedidos localmente
let pedidos = [];

// Função para exibir o modal
function abrirModal(modo = 'criar', pedido = null) {
    modal.style.display = 'block';
    if (modo === 'criar') {
        modalTitle.textContent = 'Adicionar Novo Pedido';
        submitBtn.textContent = 'Salvar Pedido';
        formPedido.reset();
        formPedido.setAttribute('data-modo', 'criar');
        document.getElementById('pedido-id').value = '';
    } else if (modo === 'detalhes') {
        const pedidoIdFormatado = pedido.id.toString().padStart(4, '0');
        modalTitle.textContent = `Detalhes do Pedido #${pedidoIdFormatado}`;
        submitBtn.textContent = 'Salvar Edições';
        formPedido.setAttribute('data-modo', 'editar');
        document.getElementById('pedido-id').value = pedido.id;
        document.getElementById('tipo').value = pedido.tipo;
        document.getElementById('endereco').value = pedido.endereco;
        document.getElementById('cliente-nome').value = pedido.cliente_nome;
        document.getElementById('telefone').value = pedido.telefone;
        document.getElementById('email').value = pedido.email;
    }
}

// Função para fechar o modal
function fecharModal() {
    modal.style.display = 'none';
}

// Função para renderizar um único item de pedido
function renderizarPedido(pedido) {
    const li = document.createElement('li');
    li.classList.add('pedido-item');
    li.setAttribute('data-id', pedido.id);

    const pedidoIdFormatado = pedido.id.toString().padStart(4, '0');
    const statusClass = pedido.status === 'Concluído' ? 'status-concluido' : 'status-ativo';
    
    li.innerHTML = `
        <div class="pedido-header">
            <div class="pedido-info">
                <h3>Pedido #${pedidoIdFormatado}</h3>
                <p><strong>Cliente:</strong> ${pedido.cliente_nome}</p>
                <span class="pedido-status ${statusClass}">${pedido.status}</span>
            </div>
            <div class="pedido-actions">
                <button class="concluido-btn">${pedido.status === 'Ativo' ? 'Concluído' : 'Ativo'}</button>
                <button class="excluir-btn">Excluir</button>
            </div>
        </div>
    `;

    li.querySelector('.pedido-header').addEventListener('click', (event) => {
        if (!event.target.closest('.pedido-actions')) {
            abrirModal('detalhes', pedido);
        }
    });

    li.querySelector('.concluido-btn').addEventListener('click', async () => {
        const novoStatus = pedido.status === 'Ativo' ? 'Concluído' : 'Ativo';
        await atualizarPedido(pedido.id, { status: novoStatus });
    });

    li.querySelector('.excluir-btn').addEventListener('click', async () => {
        await excluirPedido(pedido.id);
    });

    listaPedidos.appendChild(li);
}

// Função para renderizar todos os pedidos na lista
function renderizarPedidos() {
    listaPedidos.innerHTML = '';
    pedidos.forEach(pedido => renderizarPedido(pedido));
}

// Funções de CRUD usando Firebase

// Função para buscar e renderizar os pedidos do Firebase (READ)
// A função onValue é "real-time" e escuta por mudanças nos dados
function buscarERenderizarPedidos() {
    console.log('Buscando pedidos do Firebase...');
    const pedidosRef = database.ref('pedidos');
    pedidosRef.on('value', (snapshot) => {
        pedidos = [];
        snapshot.forEach((childSnapshot) => {
            const pedido = childSnapshot.val();
            pedidos.push({ id: childSnapshot.key, ...pedido });
        });
        renderizarPedidos();
        console.log('Pedidos buscados e atualizados com sucesso!');
    });
}

// Função para adicionar um novo pedido (CREATE)
async function adicionarPedido(novoPedido) {
    const newPedidoRef = database.ref('pedidos').push();
    newPedidoRef.set({
        tipo: novoPedido.tipo,
        endereco: novoPedido.endereco,
        cliente_nome: novoPedido.clienteNome,
        telefone: novoPedido.telefone,
        email: novoPedido.email,
        status: 'Ativo'
    }).then(() => {
        console.log('Pedido adicionado com sucesso!');
    }).catch((error) => {
        console.error('Erro ao adicionar pedido:', error);
    });
}

// Função para atualizar um pedido existente (UPDATE)
async function atualizarPedido(id, updates) {
    const pedidoRef = database.ref('pedidos/' + id);
    pedidoRef.update(updates).then(() => {
        console.log('Pedido atualizado com sucesso!');
    }).catch((error) => {
        console.error('Erro ao atualizar pedido:', error);
    });
}

// Função para excluir um pedido (DELETE)
async function excluirPedido(id) {
    const pedidoRef = database.ref('pedidos/' + id);
    pedidoRef.remove().then(() => {
        console.log('Pedido excluído com sucesso!');
    }).catch((error) => {
        console.error('Erro ao excluir pedido:', error);
    });
}

// Eventos e Inicialização
addPedidoBtn.addEventListener('click', () => abrirModal('criar'));
closeModalBtn.addEventListener('click', fecharModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        fecharModal();
    }
});

formPedido.addEventListener('submit', async (event) => {
    event.preventDefault();

    const modo = formPedido.getAttribute('data-modo');
    const pedidoId = document.getElementById('pedido-id').value;

    const dadosDoForm = {
        tipo: document.getElementById('tipo').value,
        endereco: document.getElementById('endereco').value,
        clienteNome: document.getElementById('cliente-nome').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
    };

    if (modo === 'criar') {
        await adicionarPedido(dadosDoForm);
    } else if (modo === 'editar') {
        await atualizarPedido(pedidoId, dadosDoForm);
    }

    fecharModal();
});

// Ao carregar a página, busca os dados do Firebase
document.addEventListener('DOMContentLoaded', buscarERenderizarPedidos);