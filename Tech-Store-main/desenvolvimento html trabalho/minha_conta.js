const ordersHistory = [
  {
    id: "#TS-9842",
    date: "10/10/2026",
    status: "Entregue",
    total: "R$ 4.599,00",
    items: ["Smartphone Motorola Moto G67 5G 256GB"]
  },
  {
    id: "#TS-8711",
    date: "25/08/2026",
    status: "Entregue",
    total: "R$ 2.199,00",
    items: ["Caixa de Som Bluetooth Prova D'Água Boombox 4 JBL"]
  }
];

function switchTab(tab) {
  const loginForm = document.getElementById('form-login');
  const regForm = document.getElementById('form-register');
  const loginTab = document.getElementById('tab-login');
  const regTab = document.getElementById('tab-register');

  if (tab === 'login') {
    loginForm.classList.add('active-form');
    regForm.classList.remove('active-form');
    loginTab.classList.add('active');
    regTab.classList.remove('active');
  } else {
    regForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
    regTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;

  const userData = { name, email };
  localStorage.setItem('techStore_user', JSON.stringify(userData));
  
  showUserProfile(userData);
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  
  const userData = {
    name: email.split('@')[0],
    email: email
  };

  localStorage.setItem('techStore_user', JSON.stringify(userData));
  showUserProfile(userData);
}

function showUserProfile(user) {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('profile-section').classList.remove('hidden');

  document.getElementById('user-display-name').textContent = user.name;
  document.getElementById('user-display-email').textContent = user.email;

  renderOrders();
}

function renderOrders() {
  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  if (ordersHistory.length === 0) {
    container.innerHTML = '<p>Você ainda não realizou nenhum pedido.</p>';
    return;
  }

  ordersHistory.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="order-header-info">
        <span>Pedido ${order.id}</span>
        <span class="order-badge">${order.status}</span>
      </div>
      <div class="order-details">
        <p><strong>Data:</strong> ${order.date}</p>
        <p><strong>Itens:</strong> ${order.items.join(', ')}</p>
        <p><strong>Total:</strong> ${order.total}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Logout
function handleLogout() {
  localStorage.removeItem('techStore_user');
  document.getElementById('profile-section').classList.add('hidden');
  document.getElementById('auth-section').classList.remove('hidden');
}

// Verifica se o usuário já estava logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('techStore_user');
  if (savedUser) {
    showUserProfile(JSON.parse(savedUser));
  }
});
