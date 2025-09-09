document.addEventListener("DOMContentLoaded", () => {
    // --------------------------
    // CARRINHO (global)
    // --------------------------
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const cartCount = document.getElementById("cart-count");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartItemsDiv = document.getElementById("cart-items");
  
    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    function updateCartCount() {
      if (cartCount) cartCount.textContent = cart.length;
    }
  
    function renderCart() {
      if (!cartItemsDiv) return;
  
      cartItemsDiv.innerHTML = "";
  
      if (!cart.length) {
        cartItemsDiv.innerHTML = "<p>O carrinho está vazio</p>";
        return;
      }
  
      cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <img src="${item.image}" alt="hat">
          <div>
            <p><strong>${item.fabric}</strong> (${item.color})</p>
            <p>${item.label || ""}</p>
          </div>
          <button class="remove-btn" data-index="${index}">
            <i class="fa-solid fa-x"></i>
          </button>
        `;
        cartItemsDiv.appendChild(div);
      });
  
      // remover item
      cartItemsDiv.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          cart.splice(btn.dataset.index, 1);
          saveCart();
          updateCartCount();
          renderCart();
        });
      });
    }
  
    // abrir/fechar sidebar
    const cartIcon = document.getElementById("cart-icon");
    const closeCart = document.getElementById("close-cart");
    cartIcon?.addEventListener("click", () => {
      renderCart();
      cartSidebar?.classList.add("open");
    });
    closeCart?.addEventListener("click", () => {
      cartSidebar?.classList.remove("open");
    });
  
    document.getElementById("checkout-btn")?.addEventListener("click", () => {
      alert("works like this :)");
    });
  
    updateCartCount();
  
    // --------------------------
    // MIXTEXT (apenas se elementos existirem)
    // --------------------------
    const hatImage = document.getElementById("hat-image");
    const nextBtn = document.querySelector(".next");
    const container = document.querySelector(".fabric-options");
    if (!hatImage || !nextBtn || !container) return;
  
    const descricaoDiv = document.querySelector(".fabric-description");
    const h2 = document.querySelector(".step-title");
    const h1 = document.querySelector(".step-subtitle");
    const fundo = document.querySelector(".botao-fundo7");
  
    const descricoes = {
      bombazine: "A bombazine, com as suas riscas em relevo...",
      algodao: "O algodão é um tecido leve, respirável...",
      impermeavel: "O tecido impermeável protege da chuva..."
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
      vinho: "#552653", verde: "#a9bea7", verde2: "#1b3222", verde3: "#315834",
      verdeclaro: "#6e9e6f", verdeclaro2: "#2a5834", rosaforte: "#bd80b2",
      mostarda: "#a89e6f", camel: "#75582b", rosa: "#a95c5c", rosa2: "#8e3679",
      roxo: "#7378ac", roxo2: "#845382", roxo3: "#795a85", azul: "#7f93bd",
      azul2: "#264761", azul3: "#247c9c", castanho: "#4f3e2d", castanho2: "#514426",
      azulescuro: "#383f53", azulescuro2: "#25404b", cinzento: "#828282", vermelho: "#87363c",
      verdeescuro: "#1a2f21", verdeescuro2: "#1a2f21"
    };
  
    let selectedFabric = null;
    let selectedColor = null;
    let currentStep = 1;
  
    // escolher tecido
    container.querySelectorAll("button").forEach(botao => {
      botao.addEventListener("click", () => {
        selectedFabric = botao.dataset.tecido;
        container.querySelectorAll("button").forEach(b => b.classList.remove("ativo"));
        botao.classList.add("ativo");
        descricaoDiv.textContent = descricoes[selectedFabric];
        hatImage.src = imagens[selectedFabric];
        document.querySelector(".progress").style.width = "33%";
      });
    });
  
    // avançar etapas
    nextBtn.addEventListener("click", () => {
      if (currentStep === 1) {
        if (!selectedFabric) return alert("Select a fabric first!");
        h2.textContent = "pick the"; h1.textContent = "color"; descricaoDiv.textContent = "";
        container.innerHTML = ""; container.classList.add("color-grid");
        coresPorTecido[selectedFabric].forEach(cor => {
          const button = document.createElement("button");
          button.className = "color-btn";
          button.style.backgroundColor = coresHex[cor] || "#ccc";
          button.addEventListener("click", () => {
            selectedColor = cor;
            hatImage.src = `img/${selectedFabric}${cor}.png`;
            document.querySelector(".progress").style.width = "66%";
          });
          container.appendChild(button);
        });
        currentStep = 2;
      } 
      else if (currentStep === 2) {
        if (!selectedColor) return alert("Pick a color first!");
        h2.textContent = "Label your"; h1.textContent = "Hat"; container.innerHTML = "";
        const input = document.createElement("input");
        input.type = "text"; input.maxLength = 24;
        input.placeholder = "Write your label (max 24 chars)";
        input.className = "name-input";
        container.appendChild(input);
  
        let label = document.querySelector(".hat-label");
        if (!label) {
          label = document.createElement("div");
          label.className = "hat-label";
          hatImage.parentElement.style.position = "relative";
          hatImage.parentElement.appendChild(label);
        }
        input.addEventListener("input", () => label.textContent = input.value);
        document.querySelector(".progress").style.width = "100%";
        currentStep = 3;
      } 
      else if (currentStep === 3) {
        document.querySelector(".left-column")?.classList.add("hidden");
        const rightCol = document.querySelector(".right-column");
        rightCol?.classList.add("expandido");
        hatImage.style.margin = "200px 0 0 0";
        container.innerHTML = "";
  
        const addBtn = document.createElement("button");
        const progress = document.querySelector(".progress-bar");
        addBtn.textContent = "Adicionar";
        addBtn.className = "add-btn";
        rightCol?.appendChild(addBtn);
  
        addBtn.addEventListener("click", () => {
          const hatLabel = document.querySelector(".hat-label")?.textContent || "";
          const item = { fabric: selectedFabric, color: selectedColor, label: hatLabel, image: hatImage.src };
          cart.push(item); saveCart(); updateCartCount();
          alert("Chapéu adicionado ao carrinho!");
        });
  
        nextBtn.style.display = "none";
        fundo.style.display = "none";
        progress.style.display = "none";
        currentStep = 4;
      }
    });
  });
  