(() => {
  const CART_KEY = 'padel_cart';
  const HEADER_PARTIAL_PATH = 'assets/partials/header.html';

  const EVENTS = {
    'torneio-open-primavera': {
      id: 'torneio-open-primavera',
      name: 'Torneio Open Primavera',
      category: 'Torneio',
      description:
        'Torneio aberto para todos os niveis, com fase de grupos e eliminatorias. Inclui welcome pack e premiacao final.',
      date: '20 Abril 2026',
      time: '09:00 - 19:00',
      place: 'Clube Padel, Sao Joao da Madeira',
      image: 'assets/img/padel1.jpg',
      adultPrice: 15,
      childPrice: 8,
    },
    'tarde-de-finos': {
      id: 'tarde-de-finos',
      name: 'Tarde de Finos e Convivio',
      category: 'Social',
      description:
        'Fim de tarde descontraido com musica ambiente, zona lounge e networking entre atletas e socios do clube.',
      date: '4 Maio 2026',
      time: '18:30 - 22:30',
      place: 'Bar e Esplanada do Clube',
      image: 'assets/img/cafe.png',
      adultPrice: 10,
      childPrice: 5,
    },
    'clinica-junior': {
      id: 'clinica-junior',
      name: 'Clinica Junior de Padel',
      category: 'Formacao',
      description:
        'Sessao intensiva para jovens atletas com tecnicos do clube, focada em tecnica, deslocamento e jogo tatico.',
      date: '12 Maio 2026',
      time: '10:00 - 13:00',
      place: 'Campos 1 e 2 - Clube Padel',
      image: 'assets/img/kids.jpg',
      adultPrice: 12,
      childPrice: 6,
    },
  };

  const CAUSES = {
    'open-clube': {
      id: 'open-clube',
      name: 'Apadrinhar o Open do Clube',
      tag: 'Torneio',
      summary: 'Elevar o torneio anual com premios, cobertura e apoio total aos atletas.',
      description:
        'O Open do Clube e o momento alto da temporada. Com o teu apoio, conseguimos garantir arbitragem, premios, materiais e uma experiencia memoravel para todos os participantes.',
      goal: 'Meta: 6.000€ para organizacao e premios.',
      image: 'assets/img/padel1.jpg',
    },
    'carrinha-transporte': {
      id: 'carrinha-transporte',
      name: 'Comprar uma carrinha de transporte',
      tag: 'Logistica',
      summary: 'Garantir deslocacoes seguras e regulares para atletas e equipas.',
      description:
        'Precisamos de uma carrinha para levar equipas a torneios e garantir logistica em eventos sociais. A carrinha vai permitir poupar custos e dar mais conforto aos atletas.',
      goal: 'Meta: 18.000€ para aquisicao e legalizacao.',
      image: 'assets/img/padel3.jpg',
    },
  };

  const BLOG_POSTS = {
    'primavera-open': {
      id: 'primavera-open',
      title: 'Open de Primavera: inscricoes abertas',
      category: 'Torneio',
      date: '2026-03-12',
      dateLabel: '12 Mar 2026',
      excerpt:
        'Prepara a dupla e garante lugar no Open de Primavera com fases de grupos e eliminatorias.',
      image: 'assets/img/padel1.jpg',
      content: [
        'O Open de Primavera marca o arranque da temporada competitiva do clube, com um formato dinamico pensado para todos os niveis.',
        'As inscricoes estao abertas para pares masculinos, femininos e mistos, com grupos iniciais e eliminatorias finais.',
        'Os socios beneficiam de desconto especial na inscricao e acesso prioritario a horarios de treino.'
      ],
    },
    'novos-horarios': {
      id: 'novos-horarios',
      title: 'Novos horarios de treino para 2026',
      category: 'Academia',
      date: '2026-02-28',
      dateLabel: '28 Fev 2026',
      excerpt:
        'Mais turmas pos-laborais, aulas intensivas de fim de semana e planos para iniciantes.',
      image: 'assets/img/padel2.jpg',
      content: [
        'A partir de março, a academia passa a ter novas turmas de iniciacao, aperfeicoamento e competicao.',
        'Incluimos mais horarios pos-laborais e slots de fim de semana para responder a procura crescente.',
        'Consulta o calendario atualizado e garante o teu lugar com antecedencia.'
      ],
    },
    'noite-social': {
      id: 'noite-social',
      title: 'Noite social no bar do clube',
      category: 'Clube',
      date: '2026-02-10',
      dateLabel: '10 Fev 2026',
      excerpt:
        'Musica ambiente, menu especial e uma noite para celebrar a comunidade do clube.',
      image: 'assets/img/padel3.jpg',
      content: [
        'A noite social e o encontro mensal entre socios, atletas e equipa tecnica.',
        'Teremos menu especial, musica ao vivo e um espaco reservado para networking.',
        'Entrada livre para socios e convidados, com oferta de welcome drink.'
      ],
    },
  };

  const getCart = () => {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  };

  const saveCart = (items) => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart:updated'));
  };

  const parsePriceToNumber = (priceLabel) => {
    const numeric = String(priceLabel).replace(/[^\d,.-]/g, '').replace(',', '.');
    const value = Number(numeric);
    return Number.isFinite(value) ? value : 0;
  };

  const formatEuro = (value) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);

  const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const aliases = {
      'produto.html': 'loja.html',
      'carrinho.html': 'loja.html',
      'evento.html': 'eventos.html',
    };
    const activePage = aliases[currentPage] || currentPage;
    const links = document.querySelectorAll('#siteHeader a.nav-link');

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('http')) return;

      const normalized = href.split('/').pop();
      const isActive = normalized === activePage;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const initHeader = async () => {
    const mount = document.getElementById('siteHeader');
    if (!mount) return;

    try {
      const response = await fetch(HEADER_PARTIAL_PATH);
      if (!response.ok) throw new Error('Falha ao carregar o header');
      mount.innerHTML = await response.text();
      setActiveNavLink();
    } catch (err) {
      console.warn('Header: nao foi possivel carregar o componente.', err);
    }
  };

  const getCartSummary = () => {
    const items = getCart();
    const totalQty = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    return { items, totalQty };
  };

  const initCartWidget = () => {
    const root = document.body;
    if (!root) return;

    let widget = document.getElementById('cartFloatingWidget');
    if (!widget) {
      widget = document.createElement('a');
      widget.id = 'cartFloatingWidget';
      widget.href = 'carrinho.html';
      widget.className = 'cart-floating-widget d-none';
      widget.setAttribute('aria-label', 'Abrir carrinho');
      widget.innerHTML = `
        <i class="bi bi-cart3" aria-hidden="true"></i>
        <span>Carrinho</span>
        <span class="badge rounded-pill cart-floating-count" id="cartFloatingCount">0</span>
      `;
      root.appendChild(widget);
    }

    const countEl = widget.querySelector('#cartFloatingCount');

    const render = () => {
      const { totalQty } = getCartSummary();
      if (countEl) countEl.textContent = String(totalQty);
      widget.classList.toggle('d-none', totalQty === 0);
    };

    window.addEventListener('cart:updated', render);
    window.addEventListener('storage', render);
    render();
  };

  const initContactMapZoom = () => {
    const section = document.querySelector('.contact-map-zoom-section');
    const mapFrame = document.querySelector('.contacts-map-embed');
    if (!section || !mapFrame) return;

    let ticking = false;

    const updateMapScale = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const start = sectionTop - viewportHeight;
      const end = sectionBottom;
      const progress = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
      const scale = 1 + progress * 0.18;
      mapFrame.style.setProperty('--contacts-map-scale', scale.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateMapScale);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateMapScale();
  };

  const initCoffeeZoom = () => {
    const section = document.querySelector('.coffee-zoom-section');
    const wrap = document.querySelector('.coffee-zoom-wrap');
    if (!section || !wrap) return;

    let ticking = false;

    const updateCoffeeZoom = () => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const start = sectionTop - viewportHeight;
      const end = sectionBottom;
      const progress = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
      const scale = 1 + progress * 0.8;
      wrap.style.setProperty('--coffee-bg-scale', scale.toFixed(3));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateCoffeeZoom);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateCoffeeZoom();
  };

  const initMembersFilters = () => {
    const filterButtons = document.querySelectorAll('.members-filter-chip');
    const cards = document.querySelectorAll('.members-card-col');
    const searchInput = document.querySelector('#membersSearch');
    const emptyState = document.querySelector('#membersEmptyState');
    if (!filterButtons.length || !cards.length || !emptyState) return;

    let activeFilter = 'todos';

    const applyFilters = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      let visibleCount = 0;

      cards.forEach((card) => {
        const categories = (card.dataset.categories || '').split(/\s+/);
        const name = (card.dataset.name || '').toLowerCase();
        const matchesCategory = activeFilter === 'todos' || categories.includes(activeFilter);
        const matchesSearch = !query || name.includes(query);
        const visible = matchesCategory && matchesSearch;
        card.classList.toggle('d-none', !visible);
        if (visible) visibleCount += 1;
      });

      emptyState.classList.toggle('d-none', visibleCount > 0);
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || 'todos';
        filterButtons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        applyFilters();
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    applyFilters();
  };

  const initMembersModal = () => {
    const modalEl = document.getElementById('membersProfileModal');
    const nameEl = document.getElementById('membersProfileName');
    const imageEl = document.getElementById('membersProfileImage');
    const descEl = document.getElementById('membersProfileDescription');
    if (!modalEl || !nameEl || !imageEl || !descEl) return;

    const buttons = document.querySelectorAll('.members-profile-btn');
    if (!buttons.length) return;

    const openModal = (card) => {
      if (!card) return;
      const name = card.dataset.name || card.querySelector('.members-card-title')?.textContent?.trim();
      const description =
        card.dataset.description ||
        'Perfil em atualização. Em breve teremos mais detalhes sobre este membro.';
      const img = card.querySelector('img');

      nameEl.textContent = name || 'Membro';
      descEl.textContent = description;
      if (img) {
        imageEl.src = img.getAttribute('src') || '';
        imageEl.alt = img.getAttribute('alt') || name || 'Membro';
      }

      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    };

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const card = button.closest('.members-card-col');
        openModal(card);
      });
    });
  };

  const initBlogList = () => {
    const filter = document.getElementById('blogSortFilter');
    const grid = document.getElementById('blogGrid');
    if (!filter || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.blog-card-col'));
    if (!cards.length) return;

    const sortCards = (order) => {
      const sorted = [...cards].sort((a, b) => {
        const aDate = new Date(a.dataset.date || '');
        const bDate = new Date(b.dataset.date || '');
        return order === 'antigas' ? aDate - bDate : bDate - aDate;
      });

      grid.innerHTML = '';
      sorted.forEach((card) => grid.appendChild(card));
    };

    filter.addEventListener('change', () => sortCards(filter.value));
    sortCards(filter.value);
  };

  const initBlogPostPage = () => {
    const titleEl = document.getElementById('blogPostTitle');
    const dateEl = document.getElementById('blogPostDate');
    const categoryEl = document.getElementById('blogPostCategory');
    const imageEl = document.getElementById('blogPostImage');
    const contentEl = document.getElementById('blogPostContent');
    if (!titleEl || !dateEl || !categoryEl || !imageEl || !contentEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'primavera-open';
    const post = BLOG_POSTS[id] || BLOG_POSTS['primavera-open'];

    titleEl.textContent = post.title;
    dateEl.textContent = post.dateLabel;
    categoryEl.textContent = post.category;
    imageEl.src = post.image;
    imageEl.alt = post.title;
    document.title = `${post.title} | Blog`;

    contentEl.innerHTML = '';
    post.content.forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      contentEl.appendChild(p);
    });
  };

  const initSocioPage = () => {
    const selectButtons = document.querySelectorAll('.membership-select');
    const collapseEl = document.getElementById('membershipFormCollapse');
    const nameEl = document.getElementById('membershipSelectedName');
    const descEl = document.getElementById('membershipSelectedDesc');
    const priceEl = document.getElementById('membershipSelectedPrice');
    const backBtn = document.querySelector('.membership-back');
    const form = document.getElementById('membershipForm');
    if (!selectButtons.length || !collapseEl || !nameEl || !descEl || !priceEl) return;

    const collapse = new bootstrap.Collapse(collapseEl, { toggle: false });

    const applySelection = (button) => {
      const card = button.closest('.membership-card');
      const plan = button.dataset.plan || 'Plano';
      const desc = button.dataset.desc || '';
      const price = button.dataset.price || '';

      document.querySelectorAll('.membership-card').forEach((item) => {
        item.classList.toggle('is-selected', item === card);
      });

      nameEl.textContent = plan;
      descEl.textContent = desc;
      priceEl.textContent = price;

      collapse.show();
      collapseEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    selectButtons.forEach((button) => {
      button.addEventListener('click', () => applySelection(button));
    });

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        collapse.hide();
        const hero = document.querySelector('.membership-hero');
        if (hero) {
          hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedName = nameEl.textContent.trim();
        const selectedPrice = priceEl.textContent.trim();

        if (!selectedName || selectedName === '—') {
          window.alert('Seleciona um plano antes de continuar.');
          return;
        }

        const cart = getCart();
        cart.push({
          id: `socio-${selectedName.toLowerCase().replace(/\s+/g, '-')}`,
          name: `Quota ${selectedName}`,
          category: 'Ser sócio',
          image: 'assets/img/padel1.jpg',
          price: selectedPrice.split('/')[0].trim(),
          qty: 1,
        });
        saveCart(cart);
        window.location.href = 'carrinho.html';
      });
    }
  };

  const initShopFilter = () => {
    const filter = document.querySelector('#shopCategoryFilter');
    const items = document.querySelectorAll('.shop-item');
    const emptyState = document.querySelector('#shopEmptyState');
    if (!filter || !items.length || !emptyState) return;

    const applyFilter = () => {
      const value = filter.value;
      let visibleCount = 0;

      items.forEach((item) => {
        const category = item.dataset.category || '';
        const visible = value === 'todas' || category === value;
        item.classList.toggle('d-none', !visible);
        if (visible) visibleCount += 1;
      });

      emptyState.classList.toggle('d-none', visibleCount > 0);
    };

    filter.addEventListener('change', applyFilter);
    applyFilter();
  };

  const initProductPage = () => {
    const nameEl = document.getElementById('productName');
    const categoryEl = document.getElementById('productCategory');
    const descEl = document.getElementById('productDescription');
    const priceEl = document.getElementById('productPrice');
    const imageEl = document.getElementById('productImage');
    const breadcrumbEl = document.getElementById('productBreadcrumbName');
    const qtyInput = document.getElementById('productQty');
    const qtyButtons = document.querySelectorAll('[data-qty-action]');
    const addBtn = document.getElementById('productAddButton');
    if (!nameEl || !categoryEl || !descEl || !priceEl || !imageEl || !breadcrumbEl || !qtyInput || !addBtn) return;

    const products = {
      'raquete-pro-one': {
        id: 'raquete-pro-one',
        name: 'Raquete Pro One',
        category: 'Raquetes',
        description: 'Potencia e controlo para jogo ofensivo.',
        price: '€129,90',
        image: 'assets/img/raquete1.png',
      },
      'raquete-control-x': {
        id: 'raquete-control-x',
        name: 'Raquete Control X',
        category: 'Raquetes',
        description: 'Precisao para jogadores intermédios.',
        price: '€109,90',
        image: 'assets/img/raquete2.png',
      },
      'raquete-spin-elite': {
        id: 'raquete-spin-elite',
        name: 'Raquete Spin Elite',
        category: 'Raquetes',
        description: 'Leve, rapida e com excelente manobrabilidade.',
        price: '€139,90',
        image: 'assets/img/raquete4.png',
      },
      'pack-bolas-padel': {
        id: 'pack-bolas-padel',
        name: 'Pack Bolas Padel',
        category: 'Bolas',
        description: 'Bolas pressurizadas para treino e torneio.',
        price: '€14,90',
        image: 'assets/img/bolas3.png',
      },
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'raquete-pro-one';
    const product = products[id] || products['raquete-pro-one'];

    nameEl.textContent = product.name;
    categoryEl.textContent = product.category;
    descEl.textContent = product.description;
    priceEl.textContent = product.price;
    imageEl.src = product.image;
    imageEl.alt = product.name;
    breadcrumbEl.textContent = product.name;
    document.title = `${product.name} | Loja Padel`;

    qtyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const current = Number(qtyInput.value) || 1;
        const action = button.dataset.qtyAction;
        if (action === 'minus') qtyInput.value = String(Math.max(1, current - 1));
        if (action === 'plus') qtyInput.value = String(current + 1);
      });
    });

    addBtn.addEventListener('click', () => {
      const qty = Number(qtyInput.value) || 1;
      const cart = getCart();
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          qty,
        });
      }
      saveCart(cart);
      window.location.href = 'carrinho.html';
    });
  };

  const initEventPage = () => {
    const nameEl = document.getElementById('eventName');
    const categoryEl = document.getElementById('eventCategory');
    const descEl = document.getElementById('eventDescription');
    const dateEl = document.getElementById('eventDate');
    const timeEl = document.getElementById('eventTime');
    const placeEl = document.getElementById('eventPlace');
    const imageEl = document.getElementById('eventImage');
    const breadcrumbEl = document.getElementById('eventBreadcrumbName');
    const adultPriceEl = document.getElementById('eventAdultPrice');
    const childPriceEl = document.getElementById('eventChildPrice');
    const adultQtyEl = document.getElementById('eventAdultQty');
    const childQtyEl = document.getElementById('eventChildQty');
    const qtyButtons = document.querySelectorAll('[data-event-qty-action]');
    const buyBtn = document.getElementById('eventBuyButton');

    if (
      !nameEl ||
      !categoryEl ||
      !descEl ||
      !dateEl ||
      !timeEl ||
      !placeEl ||
      !imageEl ||
      !breadcrumbEl ||
      !adultPriceEl ||
      !childPriceEl ||
      !adultQtyEl ||
      !childQtyEl ||
      !qtyButtons.length ||
      !buyBtn
    ) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'torneio-open-primavera';
    const event = EVENTS[id] || EVENTS['torneio-open-primavera'];

    nameEl.textContent = event.name;
    categoryEl.textContent = event.category;
    descEl.textContent = event.description;
    dateEl.textContent = event.date;
    timeEl.textContent = event.time;
    placeEl.textContent = event.place;
    imageEl.src = event.image;
    imageEl.alt = event.name;
    breadcrumbEl.textContent = event.name;
    adultPriceEl.textContent = formatEuro(event.adultPrice);
    childPriceEl.textContent = formatEuro(event.childPrice);
    document.title = `${event.name} | Eventos`;

    qtyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        const action = button.getAttribute('data-event-qty-action');
        const input = target === 'child' ? childQtyEl : adultQtyEl;
        const current = Number(input.value) || 0;
        if (action === 'minus') input.value = String(Math.max(0, current - 1));
        if (action === 'plus') input.value = String(current + 1);
      });
    });

    buyBtn.addEventListener('click', () => {
      const adultQty = Number(adultQtyEl.value) || 0;
      const childQty = Number(childQtyEl.value) || 0;

      if (adultQty + childQty <= 0) {
        window.alert('Seleciona pelo menos 1 bilhete.');
        return;
      }

      const cart = getCart();

      if (adultQty > 0) {
        const adultId = `${event.id}-adulto`;
        const existingAdult = cart.find((item) => item.id === adultId);
        if (existingAdult) {
          existingAdult.qty += adultQty;
        } else {
          cart.push({
            id: adultId,
            name: `${event.name} - Bilhete Adulto`,
            category: 'Evento',
            image: event.image,
            price: formatEuro(event.adultPrice),
            qty: adultQty,
          });
        }
      }

      if (childQty > 0) {
        const childId = `${event.id}-crianca`;
        const existingChild = cart.find((item) => item.id === childId);
        if (existingChild) {
          existingChild.qty += childQty;
        } else {
          cart.push({
            id: childId,
            name: `${event.name} - Bilhete Crianca`,
            category: 'Evento',
            image: event.image,
            price: formatEuro(event.childPrice),
            qty: childQty,
          });
        }
      }

      saveCart(cart);
      window.location.href = 'carrinho.html';
    });
  };

  const initDonationPage = () => {
    const form = document.getElementById('donationForm');
    const customAmountInput = document.getElementById('donationCustomAmount');
    const emailInput = document.getElementById('donationEmail');
    const causeBadge = document.getElementById('donationCauseBadge');
    if (!form || !customAmountInput || !emailInput) return;

    const amountInputs = form.querySelectorAll('input[name="donationAmount"]');
    const getSelectedAmount = () =>
      form.querySelector('input[name="donationAmount"]:checked');

    const toggleCustomAmount = () => {
      const selected = getSelectedAmount();
      const isOther = selected && selected.value === 'other';
      customAmountInput.disabled = !isOther;
      if (!isOther) customAmountInput.value = '';
    };

    amountInputs.forEach((input) => {
      input.addEventListener('change', toggleCustomAmount);
    });

    toggleCustomAmount();

    const params = new URLSearchParams(window.location.search);
    const causeId = params.get('cause');
    const cause = causeId ? CAUSES[causeId] : null;

    if (cause && causeBadge) {
      causeBadge.textContent = `Causa: ${cause.name}`;
      causeBadge.classList.remove('d-none');
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const selected = getSelectedAmount();
      const email = emailInput.value.trim();

      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
      }

      let amount = 0;
      if (!selected) {
        amount = 0;
      } else if (selected.value === 'other') {
        amount = parsePriceToNumber(customAmountInput.value);
      } else {
        amount = Number(selected.value);
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        window.alert('Indica um montante valido para o donativo.');
        return;
      }

      const cart = getCart();
      const formatted = formatEuro(amount);
      const donationName = cause ? `Donativo: ${cause.name}` : `Donativo ${formatted}`;
      const donationCategory = cause ? 'Causa' : 'Donativo';
      cart.push({
        id: `donativo-${cause ? cause.id : 'geral'}-${Date.now()}`,
        name: donationName,
        category: donationCategory,
        image: cause ? cause.image : 'assets/img/bolas.jpg',
        price: formatted,
        qty: 1,
        email,
      });
      saveCart(cart);
      window.location.href = 'carrinho.html';
    });
  };

  const initCausePage = () => {
    const titleEl = document.getElementById('causeTitle');
    const summaryEl = document.getElementById('causeSummary');
    const descriptionEl = document.getElementById('causeDescription');
    const mediaEl = document.getElementById('causeMedia');
    const goalEl = document.getElementById('causeGoal');
    const tagEl = document.getElementById('causeTag');
    const breadcrumbEl = document.getElementById('causeBreadcrumb');
    const donateBtn = document.getElementById('causeDonateBtn');
    const donateBtnSide = document.getElementById('causeDonateBtnSide');

    if (
      !titleEl ||
      !summaryEl ||
      !descriptionEl ||
      !mediaEl ||
      !goalEl ||
      !tagEl ||
      !breadcrumbEl ||
      !donateBtn ||
      !donateBtnSide
    ) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const causeId = params.get('cause') || 'open-clube';
    const cause = CAUSES[causeId] || CAUSES['open-clube'];

    titleEl.textContent = cause.name;
    summaryEl.textContent = cause.summary;
    descriptionEl.textContent = cause.description;
    goalEl.textContent = cause.goal;
    tagEl.textContent = cause.tag;
    breadcrumbEl.textContent = cause.name;
    document.title = `${cause.name} | Causas`;

    mediaEl.innerHTML = `<img src=\"${cause.image}\" alt=\"${cause.name}\">`;

    const donateLink = `donativos.html?cause=${cause.id}`;
    donateBtn.setAttribute('href', donateLink);
    donateBtnSide.setAttribute('href', donateLink);
  };

  const initCartPage = () => {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('cartEmptyState');
    const summary = document.getElementById('cartSummary');
    const totalEl = document.getElementById('cartTotal');
    const clearBtn = document.getElementById('cartClearBtn');
    if (!container || !emptyState || !summary || !totalEl || !clearBtn) return;

    const render = () => {
      const cart = getCart();
      container.innerHTML = '';

      if (!cart.length) {
        emptyState.classList.remove('d-none');
        summary.classList.add('d-none');
        return;
      }

      emptyState.classList.add('d-none');
      summary.classList.remove('d-none');

      let total = 0;

      cart.forEach((item) => {
        const itemPrice = parsePriceToNumber(item.price);
        const subtotal = itemPrice * item.qty;
        total += subtotal;

        const col = document.createElement('div');
        col.className = 'col-12';
        col.innerHTML = `
          <article class="card border-0 shadow-sm">
            <div class="card-body d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
              <img src="${item.image}" alt="${item.name}" class="cart-item-image">
              <div class="flex-grow-1">
                <h2 class="h5 mb-1">${item.name}</h2>
                <p class="text-secondary mb-1">${item.category}</p>
                <p class="mb-0">Qtd: <strong>${item.qty}</strong></p>
              </div>
              <div class="text-md-end">
                <p class="h5 mb-2">${formatEuro(subtotal)}</p>
                <button type="button" class="btn btn-outline-dark btn-sm" data-remove-id="${item.id}">Remover</button>
              </div>
            </div>
          </article>
        `;
        container.appendChild(col);
      });

      totalEl.textContent = formatEuro(total);

      container.querySelectorAll('[data-remove-id]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-remove-id');
          const next = getCart().filter((item) => item.id !== id);
          saveCart(next);
          render();
        });
      });
    };

    clearBtn.addEventListener('click', () => {
      saveCart([]);
      render();
    });

    render();
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initCartWidget();
    initCoffeeZoom();
    initContactMapZoom();
    initMembersFilters();
    initMembersModal();
    initBlogList();
    initBlogPostPage();
    initSocioPage();
    initShopFilter();
    initProductPage();
    initEventPage();
    initDonationPage();
    initCausePage();
    initCartPage();
  });
})();
