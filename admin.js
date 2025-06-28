// Espera o HTML da página ser completamente carregado para então executar o script.
// Isso é uma boa prática para garantir que todos os elementos HTML existam antes de tentarmos manipulá-los.
document.addEventListener('DOMContentLoaded', () => {

  // Aqui, "pegamos" os elementos do HTML e guardamos em variáveis para poder usá-los depois.
  const userForm = document.getElementById('user-form');
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');
  const userList = document.getElementById('user-list');
  const clearFieldsButton = document.getElementById('clear-fields');
  const searchInput = document.getElementById('search');
  const deleteAllButton = document.getElementById('delete-all');

  // Função para buscar os usuários salvos no Local Storage.
  // O Local Storage só guarda texto (string), então usamos JSON.parse para transformar o texto de volta em um objeto/array.
  const getStoredUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || [];
  };

  // Função para salvar os usuários no Local Storage.
  // Usamos JSON.stringify para transformar nosso array de usuários em uma string de texto antes de salvar. [cite: 19]
  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // Função principal que "desenha" a lista de usuários na tela.
  // Ela pode receber uma lista de usuários para mostrar (útil para a busca) ou pegar todos do Local Storage.
  const renderUsers = (usersToRender) => {
    const users = usersToRender || getStoredUsers();
    userList.innerHTML = ''; // Limpa a lista atual na tela para não duplicar itens.

    // Se não tiver usuários, mostra uma mensagem.
    if (users.length === 0) {
      userList.innerHTML = '<li>Nenhum usuário cadastrado.</li>';
      return;
    }

    // Para cada usuário no array, cria um item na lista (<li>).
    users.forEach((user, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${user.name}</strong> (${user.email}) - <em>Cadastrado em: ${user.date}</em>
        <button class="delete-btn" data-index="${index}">Excluir</button>
      `; // O data-index é um truque para sabermos qual item apagar.
      userList.appendChild(li);
    });
  };

  // Função para cadastrar um novo usuário. [cite: 18]
  userForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede que o formulário recarregue a página, que é o comportamento padrão.

    const newUser = {
      name: userNameInput.value,
      email: userEmailInput.value,
      date: new Date().toLocaleDateString('pt-BR') // Pega a data atual formatada.
    };

    const users = getStoredUsers();
    users.push(newUser); // Adiciona o novo usuário ao array.
    saveUsers(users); // Salva o array atualizado no Local Storage.
    renderUsers(); // Atualiza a lista na tela.
    userForm.reset(); // Limpa os campos do formulário.
  });

  // Função para limpar os campos do formulário. [cite: 22]
  clearFieldsButton.addEventListener('click', () => {
    userForm.reset();
  });

  // Função para excluir UM usuário específico. [cite: 20]
  // Adicionamos o "escutador" de eventos na lista inteira (<ul>).
  // Ele verifica se o clique foi em um botão com a classe 'delete-btn'.
  userList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const userIndex = event.target.getAttribute('data-index'); // Pega o 'data-index' que definimos.
      const users = getStoredUsers();
      users.splice(userIndex, 1); // Remove o usuário do array na posição 'userIndex'.
      saveUsers(users); // Salva a lista atualizada.
      renderUsers(); // "Redesenha" a lista na tela.
    }
  });

  // Função para excluir TODOS os usuários. [cite: 21]
  deleteAllButton.addEventListener('click', () => {
    // Pede uma confirmação antes de apagar tudo.
    if (confirm('Tem certeza que deseja excluir todos os usuários?')) {
      saveUsers([]); // Salva um array vazio no Local Storage.
      renderUsers(); // Atualiza a tela, que agora ficará vazia.
    }
  });

  // Função de pesquisa, que filtra a lista enquanto o usuário digita. 
  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase(); // Pega o termo da busca em minúsculas para não diferenciar maiúsculas/minúsculas.
    const users = getStoredUsers();

    const filteredUsers = users.filter(user => {
      return user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm);
    });

    renderUsers(filteredUsers); // Mostra na tela apenas os usuários filtrados.
  });

  // Chama a função renderUsers() assim que a página carrega, para mostrar os usuários que já estão salvos.
  renderUsers();
});