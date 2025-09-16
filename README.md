# Sistema de Pedidos Mugshot Store

Este é um sistema de gerenciamento de pedidos desenvolvido para a Mugshot Store. A aplicação permite que os funcionários façam login, visualizem a lista de pedidos, e gerenciem cada um deles com funcionalidades de adicionar, editar, marcar como concluído e excluir.

---

### 📋 Funcionalidades

-   **Autenticação de Usuário:** Sistema de login seguro para funcionários, utilizando o Firebase Authentication.
-   **Gerenciamento de Pedidos:** Listagem completa de todos os pedidos cadastrados, com status dinâmico.
-   **CRUD Completo:**
    -   **C**riar novos pedidos com informações detalhadas.
    -   **R**eceber e exibir todos os pedidos em tempo real (Firebase).
    -   **U**pdate: Editar detalhes de um pedido existente ou marcar seu status como "Concluído".
    -   **D**elete: Excluir um pedido permanentemente.
-   **Interface Intuitiva:** Modais (`pop-ups`) para login e formulário de pedido, facilitando a interação.
-   **Layout Personalizado:** Design responsivo com um fundo temático de caneca, criado especialmente para o projeto.

---

### 💻 Tecnologias Utilizadas

-   **Frontend:** HTML5, CSS3, JavaScript ES6
-   **Backend (BaaS):** [Firebase](https://firebase.google.com/)
    -   **Firebase Authentication:** Para o sistema de login.
    -   **Firebase Realtime Database:** Para o armazenamento e sincronização dos pedidos em tempo real.

---

### 🚀 Como Configurar e Rodar o Projeto

Siga os passos abaixo para colocar o projeto em funcionamento.

#### 1. Configurar o Firebase

1.  Crie uma conta no [Firebase](https://firebase.google.com/).
2.  Crie um novo projeto e dê a ele um nome.
3.  Adicione um novo aplicativo Web ao seu projeto.
4.  Copie o objeto de configuração (`firebaseConfig`) fornecido pelo Firebase.
5.  No seu arquivo **`index.html`**, substitua o objeto `firebaseConfig` existente pelo seu.

    ```javascript
    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      databaseURL: "SUA_DATABASE_URL",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_SENDER_ID",
      appId: "SEU_APP_ID",
      measurementId: "SEU_MEASUREMENT_ID"
    };
    ```

6.  No console do Firebase, acesse as seções **Authentication** e **Realtime Database** e habilite-as para o projeto.
7.  No Realtime Database, altere as regras de segurança para que a aplicação possa ler e escrever dados, pelo menos para fins de desenvolvimento.

    ```json
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```

#### 2. Adicionar o Fundo Personalizado

1.  Adicione a imagem de fundo (`caneca-prancheta.png`) na pasta do seu projeto. Uma boa prática é criar uma pasta `assets` ou `img` para as imagens.
2.  Verifique se o caminho no seu arquivo **`style.css`** está correto.

    ```css
    background-image: url('../assets/caneca-prancheta.png');
    ```

#### 3. Rodar o Projeto

Não é necessário instalar nada, pois o projeto é puramente frontend e usa o Firebase como serviço. Basta abrir o arquivo **`index.html`** em qualquer navegador moderno.

---

### 👨‍💻 Como Usar

1.  **Login:** A página inicial abrirá o modal de login. Insira um e-mail e senha para fazer login (se já tiver uma conta criada).
2.  **Criar um Pedido:** Após o login, o botão "Adicionar Novo Pedido" será exibido. Clique nele para abrir o formulário.
3.  **Gerenciar Pedidos:** Clique em um pedido existente na lista para ver seus detalhes e opções de edição ou exclusão.

---

### 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
