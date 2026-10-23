/* TechStore - busca do cabeçalho (o carrinho é tratado por carrinho.js) */
(function () {
    "use strict";

    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchButton");
    if (!input) return;

    const cards = Array.from(document.querySelectorAll(".product"));

    function normalize(text) {
        return String(text || "")
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Páginas sem lista de produtos enviam a busca para o catálogo de celulares.
    function goToCatalog() {
        const term = input.value.trim();
        window.location.href = "celulares.html" + (term ? "?busca=" + encodeURIComponent(term) : "");
    }

    if (!cards.length) {
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") goToCatalog(); });
        if (button) button.addEventListener("click", goToCatalog);
        return;
    }

    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.hidden = true;
    empty.textContent = "Nenhum produto encontrado para a sua busca.";
    cards[0].parentElement.after(empty);

    function filter() {
        const term = normalize(input.value.trim());
        let visible = 0;
        cards.forEach(function (card) {
            const match = !term || normalize(card.textContent).includes(term);
            card.hidden = !match;
            if (match) visible++;
        });
        empty.hidden = visible !== 0;
    }

    input.addEventListener("input", filter);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") filter(); });
    if (button) button.addEventListener("click", filter);
})();
