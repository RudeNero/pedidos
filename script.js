// Seleção de elementos do DOM
const addPedidoBtn = document.getElementById('add-pedido-btn');
const listaPedidos = document.getElementById('lista-pedidos');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-btn');
const formPedido = document.getElementById('form-pedido');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

// Elementos do Login
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');

// Array para armazenar os pedidos localmente
let pedidos = [];

// Funções para lidar com os modais existentes
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

function fecharModal() {
    modal.style.display = 'none';
}

// Funções para renderizar os pedidos
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

function renderizarPedidos() {
    listaPedidos.innerHTML = '';
    pedidos.forEach(pedido => renderizarPedido(pedido));
}

// Funções de CRUD usando Firebase
function buscarERenderizarPedidos() {
    const pedidosRef = database.ref('pedidos');
    pedidosRef.on('value', (snapshot) => {
        pedidos = [];
        snapshot.forEach((childSnapshot) => {
            const pedido = childSnapshot.val();
            pedidos.push({ id: childSnapshot.key, ...pedido });
        });
        renderizarPedidos();
    });
}
async function adicionarPedido(novoPedido) {
    const contadorRef = database.ref('counters/pedidos');
    await contadorRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    }, (error, committed, snapshot) => {
        if (error) {
            console.error("Erro na transação:", error);
        } else if (committed) {
            const novoId = snapshot.val();
            const novoPedidoRef = database.ref('pedidos/' + novoId);
            novoPedidoRef.set({
                tipo: novoPedido.tipo,
                endereco: novoPedido.endereco,
                cliente_nome: novoPedido.clienteNome,
                telefone: novoPedido.telefone,
                email: novoPedido.email,
                status: 'Ativo'
            });
        }
    });
}
async function atualizarPedido(id, updates) {
    const pedidoRef = database.ref('pedidos/' + id);
    pedidoRef.update(updates);
}
async function excluirPedido(id) {
    const pedidoRef = database.ref('pedidos/' + id);
    pedidoRef.remove();
}

// **LÓGICA DE AUTENTICAÇÃO SIMPLIFICADA**

// Função para criar uma nova conta (apenas para o administrador)
// Você pode usar esta função no console do navegador para criar contas
// Exemplo: createEmployeeAccount('novo.funcionario@empresa.com', 'senha_temporaria');
function createEmployeeAccount(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('Conta de funcionário criada com sucesso!');
        })
        .catch((error) => {
            alert('Erro ao criar conta: ' + error.message);
        });
}

// Função de login simplificada
function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            alert('Login bem-sucedido!');
            // Esconde o modal de login e mostra o sistema
            loginModal.style.display = 'none';
            document.getElementById('add-pedido-btn').style.display = 'block';
            buscarERenderizarPedidos();
        })
        .catch((error) => {
            alert('Erro de login: ' + error.message);
        });
}

// Eventos dos formulários
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginUser(email, password);
});

// Checa o estado da autenticação ao carregar a página
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário logado: esconde o login e mostra o conteúdo
        loginModal.style.display = 'none';
        document.getElementById('add-pedido-btn').style.display = 'block';
        buscarERenderizarPedidos();
    } else {
        // Usuário deslogado: mostra a tela de login
        loginModal.style.display = 'block';
        document.getElementById('add-pedido-btn').style.display = 'none';
    }
});

// Eventos dos botões e formulários de pedido
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