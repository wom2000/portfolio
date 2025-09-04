document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".fabric-options button");
    const hatImage = document.getElementById("hat-image");
    const progress = document.querySelector(".progress");
    const descricaoDiv = document.querySelector(".fabric-description");
    const container = document.querySelector(".fabric-options");
    const h2 = document.querySelector("h2");
    const h1 = document.querySelector("h1");
    const nextBtn = document.querySelector(".next");
  
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
    let currentStep = 1; // 1 = tecido, 2 = cor, 3 = nome, 4 = final
  
    // Passo 1: seleção de tecido
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
  
    // Passo seguinte
    nextBtn.addEventListener("click", () => {
      if (currentStep === 1) {
        if (!selectedFabric) {
          alert("Select a fabric first!");
          return;
        }
  
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
        if (!selectedColor) {
          alert("Pick a color first!");
          return;
        }
  
        h2.textContent = "Label your";
        h1.textContent = "Hat";
        container.innerHTML = "";
  
        document.querySelector(".mixtext-container").classList.add("step-3");
  
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 30;
        input.placeholder = "Write your label (max 30 chars)";
        input.classList.add("name-input");
  
        container.appendChild(input);
  
        let label = document.querySelector(".hat-label");
        if (!label) {
          label = document.createElement("div");
          label.classList.add("hat-label");
          hatImage.parentElement.style.position = "relative";
          hatImage.parentElement.appendChild(label);
        }
  
        input.addEventListener("input", () => {
          label.textContent = input.value;
        });
  
        progress.style.width = "100%";
        currentStep = 3;
      }
  
      else if (currentStep === 3) {
        // esconder coluna esquerda
        const leftCol = document.querySelector(".left-column");
        if (leftCol) leftCol.style.display = "none";
    
        // expandir coluna direita e centralizar conteúdo
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
    
        // manter chapéu e etiqueta centrados
        hatImage.style.margin = "80px 0 0 0";
        const label = document.querySelector(".hat-label");
        if (label) {
          label.style.position = "absolute";
          label.style.top = "50%";
          label.style.left = "50%";
          label.style.transform = "translate(-90px, 10px) rotate(5deg)";
          label.style.pointerEvents = "none";
        }
    
        // esconder container antigo de inputs
        container.innerHTML = "";
    
        // criar botão Adicionar
        const addBtn = document.createElement("button");
        addBtn.textContent = "Adicionar";
        addBtn.classList.add("add-btn");
        rightCol.appendChild(addBtn);
    
        // esconder botão next e mostrar botão back
        nextBtn.style.display = "none";
    
        // criar ou mostrar botão back
        let backBtn = document.querySelector(".back");
        if (!backBtn) {
          backBtn = document.createElement("button");
          backBtn.textContent = "Back";
          backBtn.classList.add("back");
          rightCol.appendChild(backBtn);
        } else {
          backBtn.style.display = "flex";
        }
    
        // voltar à etapa anterior ao clicar em back
        backBtn.addEventListener("click", () => {
          location.reload(); // simples reload para reiniciar o fluxo, ou pode fazer voltar ao passo 3
        });
    
        currentStep = 4;
    }
    
    });
  });
  