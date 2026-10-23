const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");

// Mostrar ou esconder a senha
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Ocultar";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Mostrar";
    }
});

// Validação do formulário
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (email === "" || password === "") {
        message.textContent = "Preencha todos os campos.";
        message.style.color = "#dc2626";
        return;
    }

    if (password.length < 6) {
        message.textContent = "A senha deve ter pelo menos 6 caracteres.";
        message.style.color = "#dc2626";
        return;
    }

    // Simulação de login
    message.textContent = "Login realizado com sucesso!";
    message.style.color = "#16a34a";

    console.log("E-mail:", email);
});