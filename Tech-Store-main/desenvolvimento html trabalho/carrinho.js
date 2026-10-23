/* TechStore - carrinho compartilhado entre as páginas */
(function () {
    "use strict";
    const STORAGE_KEY = "techstore_cart";
    const BUY_SELECTOR = ".buy-button, .btn-comprar, .comprar";

    function readCart() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (_) {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (_) {
            alert("Não foi possível salvar o carrinho neste navegador.");
        }
        updateCount();
    }

    function parsePrice(text) {
        if (!text) return 0;
        const normalized = text.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", ".");
        const value = Number(normalized);
        return Number.isFinite(value) ? value : 0;
    }

    function money(value) {
        return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function updateCount() {
        const total = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        document.querySelectorAll("#cartCount, #contador").forEach(el => { el.textContent = total; });
    }

    function productFromButton(button) {
        const card = button.closest(".product, .produto, .product-card, article");
        if (!card) return null;
        const heading = card.querySelector("h3, h2, .product-name");
        const name = ((heading && heading.textContent) || card.dataset.nome || button.dataset.product || "").trim();
        const priceElement = card.querySelector(".price, .preco");
        // Prefer the visible price, because some product data attributes are outdated.
        const price = parsePrice(priceElement && priceElement.textContent) || Number(card.dataset.preco) || Number(button.dataset.price) || 0;
        const img = card.querySelector(".product-image img, .imagem-produto img, img");
        const description = card.querySelector(".description, .descricao");
        if (!name || price <= 0) {
            alert("Não consegui identificar o nome ou o preço deste produto. Confira o cartão do produto.");
            return null;
        }
        return {
            id: (name + "|" + price).toLocaleLowerCase("pt-BR"),
            name,
            price,
            image: img ? img.getAttribute("src").replace("imgs/promoções/", "imgs/promocoes/") : "",
            description: description ? description.textContent.trim() : ""
        };
    }

    function addProduct(product, button) {
        const cart = readCart();
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity = Number(existing.quantity || 1) + 1;
        else cart.push({ ...product, quantity: 1 });
        saveCart(cart);
        // Usa o botão clicado (document.activeElement não é confiável no Safari).
        if (button && button.matches(BUY_SELECTOR)) {
            const original = button.dataset.originalText || button.textContent.trim();
            button.dataset.originalText = original;
            button.textContent = "Adicionado ✓";
            button.classList.add("adicionado");
            window.setTimeout(() => {
                if (button.isConnected) {
                    button.textContent = original;
                    button.classList.remove("adicionado");
                }
            }, 1200);
        }
        alert(product.name + " foi adicionado ao carrinho!");
    }

    function renderCart() {
        const root = document.getElementById("cartItems");
        if (!root) return;
        const cart = readCart();
        root.replaceChildren();

        if (!cart.length) {
            const empty = document.createElement("p");
            empty.className = "carrinho-vazio";
            empty.textContent = "Seu carrinho está vazio. ";
            const link = document.createElement("a");
            link.href = "celulares.html";
            link.textContent = "Continuar comprando";
            empty.appendChild(link);
            root.appendChild(empty);
        }

        cart.forEach((item, index) => {
            const row = document.createElement("article");
            row.className = "produto-item-carrinho";
            const imageBox = document.createElement("div");
            imageBox.className = "imagem-carrinho";
            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.name;
                img.onerror = () => { img.remove(); imageBox.textContent = "🛍️"; };
                imageBox.appendChild(img);
            } else imageBox.textContent = "🛍️";

            const info = document.createElement("div");
            info.className = "informacoes-carrinho";
            const title = document.createElement("h3"); title.textContent = item.name;
            const desc = document.createElement("p"); desc.textContent = item.description || "Produto TechStore";
            const price = document.createElement("p"); price.className = "preco-carrinho"; price.textContent = money(item.price);
            const quantity = document.createElement("div"); quantity.className = "quantidade-carrinho";
            const minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "Diminuir quantidade");
            const qty = document.createElement("span"); qty.textContent = item.quantity;
            const plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "Aumentar quantidade");
            minus.addEventListener("click", () => changeQuantity(index, -1));
            plus.addEventListener("click", () => changeQuantity(index, 1));
            quantity.append("Quantidade: ", minus, qty, plus);
            const remove = document.createElement("button"); remove.type = "button"; remove.className = "remover-carrinho"; remove.textContent = "Remover";
            remove.addEventListener("click", () => { const current = readCart(); current.splice(index, 1); saveCart(current); renderCart(); });
            info.append(title, desc, price, quantity, remove);
            row.append(imageBox, info);
            root.appendChild(row);
        });

        const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
        const shipping = cart.length ? 30 : 0;
        const subtotalEl = document.getElementById("subtotal");
        const shippingEl = document.getElementById("frete");
        const totalEl = document.getElementById("total");
        if (subtotalEl) subtotalEl.textContent = money(subtotal);
        if (shippingEl) shippingEl.textContent = money(shipping);
        if (totalEl) totalEl.textContent = money(subtotal + shipping);
        updateCount();
    }

    function changeQuantity(index, delta) {
        const cart = readCart();
        if (!cart[index]) return;
        cart[index].quantity = Number(cart[index].quantity || 1) + delta;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    }

    // Delegação de evento: funciona com os cartões existentes sem reescrevê-los.
    document.addEventListener("click", function (event) {
        const button = event.target.closest(BUY_SELECTOR);
        if (!button) return;
        event.preventDefault();
        const product = productFromButton(button);
        if (product) addProduct(product, button);
    });

    window.TechStoreCart = { read: readCart, save: saveCart, render: renderCart, add: addProduct, money };
    document.addEventListener("DOMContentLoaded", function () { updateCount(); renderCart(); });
    updateCount();
})();
