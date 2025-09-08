document.addEventListener("DOMContentLoaded", () => {
    // --------------------------
    // CARRINHO: FUNCIONA EM TODAS AS PÁGINAS
    // --------------------------
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) cartCount.textContent = cart.length;
    }

    function renderCart() {
        const cartItemsDiv = document.getElementById("cart-items");
        if (!cartItemsDiv) return;

        cartItemsDiv.innerHTML = "";

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = "<p>O carrinho está vazio</p>";
            return;
        }

        cart.forEach((item, index) => {
            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML = `
                <img src="${item.image}" alt="hat">
                <div>
                    <p><strong>${item.fabric}</strong> (${item.color})</p>
                    <p>${item.label || ""}</p>
                </div>
                <button class="remove-btn" data-index="${index}">✖</button>
            `;
            cartItemsDiv.appendChild(div);
        });

        // Remover item
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = btn.dataset.index;
                cart.splice(idx, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCart();
            });
        });
    }

    const cartIcon = document.getElementById("cart-icon");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCart = document.getElementById("close-cart");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cartIcon && cartSidebar && closeCart) {
        cartIcon.addEventListener("click", () => {
            renderCart();
            cartSidebar.classList.add("open");
        });

        closeCart.addEventListener("click", () => {
            cartSidebar.classList.remove("open");
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => alert("Ir para o checkout..."));
    }

    updateCartCount();

    // --------------------------
    // MIXTEXT: SÓ SE ELEMENTOS EXISTIREM
    // --------------------------
    const botoes = document.querySelectorAll(".fabric-options button");
    const hatImage = document.getElementById("hat-image");
    const progress = document.querySelector(".progress");
    const descricaoDiv = document.querySelector(".fabric-description");
    const container = document.querySelector(".fabric-options");
    const h2 = document.querySelector("h2");
    const h1 = document.querySelector("h1");
    const nextBtn = document.querySelector(".next");

    if (!hatImage || !nextBtn || !container) return; // Sai se não existir elementos da página mixtext

    const descricoes = {
        bombazine: "A bombazine, com as suas riscas em relevo e textura quente, é perfeita para o tempo frio. Tem um aspeto clássico e elegante, dando ao chapéu um ar mais sofisticado e aconchegante.",
        algodao: "O algodão é um tecido leve, respirável e confortável, ideal para dias quentes. A textura macia proporciona uma sensação agradável ao toque, sendo uma opção prática e versátil que combina com vários estilos.",
        impermeavel: "O tecido impermeável protege da chuva e humidade, sem perder o estilo. Feito com materiais resistentes, é ideal para dias instáveis ou para quem procura funcionalidade no dia a dia."
    };

    const imagens = {
        bombazine: "img/hatbombazine.png",
        algodao: "img/algodaocinzento.png",
        impermeavel: "img/hatimpermeavel.png"
    };

    const coresPorTecido = {
        bombazine: ["vinho", "verde", "verdeclaro", "rosaforte", "mostarda", "rosa", "roxo", "azul"],
        algodao: ["azul2", "castanho", "roxo2", "camel", "verde2", "verdeclaro2", "azulescuro", "cinzento"],
        impermeavel: ["azul3", "azulescuro2", "castanho2", "vermelho", "verde3", "verdeescuro2", "rosa2", "roxo3"]
    };

    const coresHex = {
        vinho: "#552653",
        verde: "#a9bea7",
        verde2: "#1b3222",
        verde3: "#315834",
        verdeclaro: "#6e9e6f",
        verdeclaro2: "#2a5834",
        rosaforte: "#bd80b2",
        mostarda: "#a89e6f",
        camel: "#75582b",
        rosa: "#a95c5c",
        rosa2: "#8e3679",
        roxo: "#7378ac",
        roxo2: "#845382",
        roxo3: "#795a85",
        azul: "#7f93bd",
        azul2: "#264761",
        azul3: "#247c9c",
        castanho: "#4f3e2d",
        castanho2: "#514426",
        azulescuro: "#383f53",
        azulescuro2: "#25404b",
        cinzento: "#828282",
        vermelho: "#87363c",
        verdeescuro: "#1a2f21",
        verdeescuro2: "#1a2f21"
    };

    let selectedFabric = null;
    let selectedColor = null;
    let currentStep = 1;

    // Seleção de tecido
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const tecido = botao.dataset.tecido;
            botoes.forEach(b => b.classList.remove("ativo"));
            botao.classList.add("ativo");
            selectedFabric = tecido;
            descricaoDiv.textContent = descricoes[tecido];
            hatImage.src = imagens[tecido];
            progress.style.width = "33%";
        });
    });

    // Botão next
    nextBtn.addEventListener("click", () => {
        if (currentStep === 1) {
            if (!selectedFabric) { alert("Select a fabric first!"); return; }

            h2.textContent = "pick the";
            h1.textContent = "color";
            descricaoDiv.textContent = "";

            container.innerHTML = "";
            container.classList.add("color-grid");

            const cores = coresPorTecido[selectedFabric];
            cores.forEach(cor => {
                const button = document.createElement("button");
                button.classList.add("color-btn");
                button.style.backgroundColor = coresHex[cor] || "#ccc";

                button.addEventListener("click", () => {
                    selectedColor = cor;
                    hatImage.src = `img/${selectedFabric}${cor}.png`;
                    progress.style.width = "66%";
                });

                container.appendChild(button);
            });

            currentStep = 2;
        }
        else if (currentStep === 2) {
            if (!selectedColor) { alert("Pick a color first!"); return; }

            h2.textContent = "Label your";
            h1.textContent = "Hat";
            container.innerHTML = "";

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 24;
            input.placeholder = "Write your label (max 24 chars)";
            input.classList.add("name-input");
            container.appendChild(input);

            let label = document.querySelector(".hat-label");
            if (!label) {
                label = document.createElement("div");
                label.classList.add("hat-label");
                hatImage.parentElement.style.position = "relative";
                hatImage.parentElement.appendChild(label);
            }

            input.addEventListener("input", () => label.textContent = input.value);
            progress.style.width = "100%";
            currentStep = 3;
        }
        else if (currentStep === 3) {
            const leftCol = document.querySelector(".left-column");
            if (leftCol) leftCol.style.display = "none";

            const rightCol = document.querySelector(".right-column");
            if (rightCol) {
                rightCol.style.width = "100%";
                rightCol.style.display = "flex";
                rightCol.style.flexDirection = "column";
                rightCol.style.alignItems = "center";
                rightCol.style.justifyContent = "center";
                rightCol.style.position = "relative";
                rightCol.style.padding = "20px";
            }

            hatImage.style.margin = "200px 0 0 0";
            const label = document.querySelector(".hat-label");
            if (label) {
                label.style.position = "absolute";
                label.style.top = "50%";
                label.style.left = "50%";
                label.style.transform = "translate(-50px, 80px) rotate(5deg)";
                label.style.pointerEvents = "none";
            }

            container.innerHTML = "";
            const addBtn = document.createElement("button");
            addBtn.textContent = "Adicionar";
            addBtn.classList.add("add-btn");
            if (rightCol) rightCol.appendChild(addBtn);

            addBtn.addEventListener("click", () => {
                const hatLabel = document.querySelector(".hat-label")?.textContent || "";
                const item = {
                    fabric: selectedFabric,
                    color: selectedColor,
                    label: hatLabel,
                    image: hatImage.src
                };
                cart.push(item);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                alert("Chapéu adicionado ao carrinho!");
            });

            nextBtn.style.display = "none";
            currentStep = 4;
        }
    });
});
