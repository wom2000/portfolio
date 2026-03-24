// dados da app vindos do php
var APP_DATA = window.APP_DATA || {};
var DEFAULT_COLLECTION = APP_DATA.DEFAULT_COLLECTION || 'plastic';
var PRODUCT_DEFAULT_SWATCHES = (APP_DATA.PRODUCT_DEFAULT_SWATCHES || ['#7f8577', '#dbd8d2', '#c7c7c0', '#b65a41', '#cfc9c3']).slice();
var PRODUCT_DEFAULT_FEATURES = (APP_DATA.PRODUCT_DEFAULT_FEATURES || ['Material leve e resistente', 'Fabricado com plastico reciclado', 'Protecao UV integrada', 'Uso interior e exterior', 'Reduz necessidade de substrato']).slice();
var BEST_SELLERS_QUOTE = APP_DATA.BEST_SELLERS_QUOTE || 'Produtos duraveis e resistentes que mantem o solo a temperatura estavel';
var BEST_SELLERS_DEFAULT_FEATURE_DESCRIPTION = APP_DATA.BEST_SELLERS_DEFAULT_FEATURE_DESCRIPTION || 'Desenvolvido com material reciclado para uma solucao mais sustentavel';
var BEST_SELLERS_BADGES = (APP_DATA.BEST_SELLERS_BADGES || []).slice();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function flashArrow(button, duration) {
  if (!button) return;
  button.classList.add('is-active');
  window.setTimeout(function () { button.classList.remove('is-active'); }, duration || 220);
}

function bindActivatable(element, onActivate) {
  element.setAttribute('tabindex', '0');
  element.setAttribute('role', 'button');
  element.addEventListener('click', onActivate);
  element.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onActivate();
  });
}

function cloneFeature(feature) {
  if (typeof feature === 'string') return feature;
  var media = feature && feature.media ? feature.media : {};
  return {
    title: feature && feature.title ? feature.title : '',
    description: feature && feature.description ? feature.description : '',
    media: {
      type: media.type || 'image',
      src: media.src || '',
      alt: media.alt || '',
      mime: media.mime || '',
      poster: media.poster || ''
    }
  };
}

function cloneHotspot(hotspot) {
  return {
    title: hotspot.title,
    related: hotspot.related,
    badge: hotspot.badge,
    image: hotspot.image,
    swatches: (hotspot.swatches || []).slice(),
    features: (hotspot.features || []).map(cloneFeature)
  };
}

// normaliza dados do overlay
function normalizeOverlayData(data) {
  if (!data) return null;
  var out = {};
  Object.keys(data).forEach(function (key) {
    var entry = data[key] || {};
    var hotspots = (entry.hotspots || []).map(cloneHotspot);
    out[key] = {
      label: entry.label || '',
      hotspots: hotspots
    };
  });
  return out;
}

function resolveOverlayCollectionKey(data, key) {
  if (data && data[key]) return key;
  var aliases = {
    'terracotta-traditional': 'terracotta',
    'terracotta-brio': 'terracotta'
  };
  var mapped = aliases[key];
  if (mapped && data && data[mapped]) return mapped;
  return key;
}

// dados do overlay
function createProductOverlayData() {
  var provided = normalizeOverlayData(window.PRODUCT_OVERLAY_DATA);
  if (provided) return provided;
  var baseHotspots = [
    { title: 'Tabuleiro Madagascar', badge: 'New', image: './assets/img/vasofechado.png', swatches: PRODUCT_DEFAULT_SWATCHES, features: PRODUCT_DEFAULT_FEATURES },
    { title: 'Tabuleiro Madagascar', badge: 'New', image: './assets/img/vasofechado.png', swatches: PRODUCT_DEFAULT_SWATCHES, features: PRODUCT_DEFAULT_FEATURES },
    { title: 'Tabuleiro Madagascar', badge: 'New', image: './assets/img/vasofechado.png', swatches: PRODUCT_DEFAULT_SWATCHES, features: PRODUCT_DEFAULT_FEATURES }
  ];

  return {
    plastic: { label: 'Plastic', hotspots: baseHotspots.map(cloneHotspot) },
    ceramics: { label: 'Ceramics', hotspots: baseHotspots.map(cloneHotspot) },
    terracotta: { label: 'Terracotta', hotspots: baseHotspots.map(cloneHotspot) }
  };
}

// dados de best sellers
function createBestSellersData() {
  if (APP_DATA.BEST_SELLERS_DATA) return APP_DATA.BEST_SELLERS_DATA;
  return {
    plastic: { label: 'Recycled Plastic', quote: BEST_SELLERS_QUOTE, items: [] },
    ceramics: { label: 'Handmade Ceramics', quote: BEST_SELLERS_QUOTE, items: [] },
    terracotta: { label: 'Traditional Terracotta', quote: BEST_SELLERS_QUOTE, items: [] }
  };
}

function initNavbarToggleLabel() {
  var toggler = document.querySelector('.navbar-toggler');
  var collapse = document.getElementById('navbarsExampleXxl');
  if (!toggler || !collapse) return;

  var closedLabel = toggler.getAttribute('data-label-closed') || 'Menu';
  var openLabel = toggler.getAttribute('data-label-open') || 'Close';

  var setLabel = function (isOpen) {
    toggler.textContent = isOpen ? openLabel : closedLabel;
    toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  collapse.addEventListener('shown.bs.collapse', function () { setLabel(true); });
  collapse.addEventListener('hidden.bs.collapse', function () { setLabel(false); });
  setLabel(collapse.classList.contains('show'));
}

function initHeroTransition() {
  var hero = document.getElementById('heroGif');
  var pots = document.getElementById('potsNew2');
  if (!hero || !pots) return;

  var delay = Number(hero.getAttribute('data-delay')) || 20000;
  var media = document.getElementById('heroGifMedia');
  var hasSwitched = false;

  var showPots = function () {
    if (hasSwitched) return;
    hasSwitched = true;
    hero.classList.add('is-hidden');
    pots.classList.add('is-visible');
    pots.setAttribute('aria-hidden', 'false');
    document.dispatchEvent(new Event('cards:refresh'));
  };

  if (media && media.tagName === 'VIDEO') {
    media.addEventListener('ended', showPots, { once: true });
    media.addEventListener('error', function () { window.setTimeout(showPots, 1500); }, { once: true });
    return;
  }

  window.setTimeout(showPots, delay);
}

function initPotsNew2() {
  var data = APP_DATA.POTS_NEW2_DATA;
  if (!data || !data.items) return;

  var section = document.getElementById('potsNew2');
  if (!section) return;

  var tabsWrap = document.getElementById('potsNew2Tabs') || section.querySelector('.pots-tabs');
  var track = document.getElementById('potsTrack2');
  if (!tabsWrap || !track) return;

  tabsWrap.innerHTML = '';
  track.innerHTML = '';

  var order = Array.isArray(data.order) && data.order.length ? data.order : Object.keys(data.items);
  order.forEach(function (key, index) {
    var item = data.items[key];
    if (!item) return;

    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'pots-tab' + (index === 0 ? ' is-active' : '');
    tab.setAttribute('data-pot-tab', key);
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.textContent = item.label || key;
    tabsWrap.appendChild(tab);

    var panel = document.createElement('div');
    panel.className = 'col-12 col-md-4 cards-col';
    panel.setAttribute('data-pot-panel', key);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    if (index !== 0) panel.hidden = true;

    var grid = document.createElement('div');
    grid.className = 'pots-mini-grid pots-mini-grid--' + key + ' pots-card-media';

    (item.tiles || []).forEach(function (tile) {
      var tileEl = document.createElement('div');
      tileEl.className = 'pots-image-tile';

      if (tile.type === 'text') {
        tileEl.classList.add('pots-image-tile--text');
        if (Array.isArray(item.textBlocks) && item.textBlocks.length) {
          tileEl.classList.add('pots-image-tile--text-rich');
          item.textBlocks.forEach(function (block) {
            var blockEl = document.createElement('div');
            blockEl.className = 'pots-image-block';

            var titleWrap = document.createElement('div');
            titleWrap.className = 'pots-image-block-title';
            if (block.eyebrow) {
              var eyebrow = document.createElement('small');
              eyebrow.className = 'font-serif';
              eyebrow.textContent = block.eyebrow;
              titleWrap.appendChild(eyebrow);
            }
            var blockTitle = document.createElement('span');
            if (block.titleHtml) {
              blockTitle.innerHTML = block.titleHtml;
            } else {
              blockTitle.textContent = block.title || '';
            }
            titleWrap.appendChild(blockTitle);
            blockEl.appendChild(titleWrap);

            if (Array.isArray(block.icons) && block.icons.length) {
              var iconsWrap = document.createElement('div');
              iconsWrap.className = 'pots-image-icons';
              block.icons.forEach(function (icon) {
                var iconItem = document.createElement('div');
                iconItem.className = 'pots-image-icon';

                var iconImg = document.createElement('img');
                iconImg.src = icon.src || '';
                iconImg.alt = icon.alt || '';
                iconItem.appendChild(iconImg);

                var iconText = document.createElement('div');
                iconText.className = 'pots-image-icon-text';
                var iconLabel = document.createElement('span');
                iconLabel.textContent = icon.label || '';
                iconText.appendChild(iconLabel);
                if (icon.sublabel) {
                  var iconSub = document.createElement('small');
                  iconSub.textContent = icon.sublabel;
                  iconText.appendChild(iconSub);
                }
                iconItem.appendChild(iconText);
                iconsWrap.appendChild(iconItem);
              });
              blockEl.appendChild(iconsWrap);
            }

            tileEl.appendChild(blockEl);
          });
        } else {
          var textWrap = document.createElement('div');
          textWrap.className = 'pots-image-text';
          var small = document.createElement('small');
          small.className = 'd-block font-serif';
          small.textContent = item.subtitle || '';
          var title = document.createElement('span');
          title.className = 'd-block';
          title.textContent = item.title || item.label || '';
          textWrap.appendChild(small);
          textWrap.appendChild(title);
          tileEl.appendChild(textWrap);
        }
      } else {
        var img = document.createElement('img');
        img.src = tile.src || '';
        img.alt = tile.alt || '';
        tileEl.appendChild(img);

        (tile.hotspots || []).forEach(function (hotspot) {
          var btn = document.createElement('button');
          btn.className = 'product-hotspot pots-image-hotspot';
          var x = typeof hotspot.x === 'number' ? hotspot.x : 50;
          var y = typeof hotspot.y === 'number' ? hotspot.y : 50;
          btn.setAttribute('style', '--x:' + x + '%;--y:' + y + '%;');
          btn.setAttribute('data-collection', key);
          btn.setAttribute('data-item-title', hotspot.title || '');
          btn.setAttribute('aria-label', 'Open ' + (hotspot.title || 'item'));
          tileEl.appendChild(btn);
        });
      }

      grid.appendChild(tileEl);
    });

    panel.appendChild(grid);
    track.appendChild(panel);
  });
}

function initPotsNewTabs() {
  var section = document.getElementById('potsNew2');
  if (!section) return;

  var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-pot-tab]'));
  var panels = Array.prototype.slice.call(section.querySelectorAll('[data-pot-panel]'));
  var prevBtn = document.querySelector('#potsNew2 [data-pot-nav="prev"]');
  var nextBtn = document.querySelector('#potsNew2 [data-pot-nav="next"]');
  if (!tabs.length || !panels.length) return;

  var setActive = function (name) {
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute('data-pot-tab') === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach(function (panel) {
      var isActive = panel.getAttribute('data-pot-panel') === name;
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    document.dispatchEvent(new Event('cards:refresh'));
  };

  window.setPotsNew2Tab = setActive;

  var initial = tabs.find(function (tab) { return tab.classList.contains('is-active'); });
  var current = initial ? initial.getAttribute('data-pot-tab') : tabs[0].getAttribute('data-pot-tab');
  setActive(current);

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      current = tab.getAttribute('data-pot-tab');
      setActive(current);
    });
  });

  var step = function (dir) {
    var index = tabs.findIndex(function (tab) { return tab.getAttribute('data-pot-tab') === current; });
    if (index === -1) index = 0;
    var nextIndex = (index + dir + tabs.length) % tabs.length;
    current = tabs[nextIndex].getAttribute('data-pot-tab');
    setActive(current);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', function () { step(-1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { step(1); });
  }
}

function initMobileCardControls() {
  var controls = document.querySelectorAll('.cards-controls[data-target]');
  if (!controls.length) return;

  controls.forEach(function (control) {
    var targetId = control.getAttribute('data-target');
    var track = targetId ? document.getElementById(targetId) : null;
    if (!track) return;

    var cards = Array.prototype.slice.call(track.querySelectorAll('.cards-col, .choose-us-item'));
    var dotsWrap = control.querySelector('.cards-dots');
    var prevBtn = control.querySelector('.cards-arrow-prev');
    var nextBtn = control.querySelector('.cards-arrow-next');
    if (!cards.length || !dotsWrap || !prevBtn || !nextBtn) return;

    var currentIndex = 0;
    var dots = cards.map(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'cards-dot';
      dot.setAttribute('aria-label', 'Go to card ' + (index + 1));
      dot.addEventListener('click', function () { goTo(index, true); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function updateUI() {
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === currentIndex);
      });
      cards.forEach(function (card, index) {
        card.classList.toggle('is-active', index === currentIndex);
      });
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= cards.length - 1;
    }

    function goTo(index, smooth) {
      var targetIndex = Math.max(0, Math.min(index, cards.length - 1));
      var card = cards[targetIndex];
      var target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      var max = track.scrollWidth - track.clientWidth;
      var left = Math.max(0, Math.min(target, max));
      if (!smooth) {
        track.scrollTo({ left: left, behavior: 'auto' });
        currentIndex = targetIndex;
        updateUI();
        return;
      }
      track.scrollTo({ left: left, behavior: 'smooth' });
    }

    function syncFromScroll() {
      var trackCenter = track.scrollLeft + track.clientWidth / 2;
      var closestIndex = 0;
      var closestDist = Number.POSITIVE_INFINITY;

      cards.forEach(function (card, index) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var distance = Math.abs(trackCenter - cardCenter);
        if (distance < closestDist) {
          closestDist = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        updateUI();
      }
    }

    prevBtn.addEventListener('click', function () {
      flashArrow(prevBtn, 220);
      goTo(currentIndex - 1, true);
    });
    nextBtn.addEventListener('click', function () {
      flashArrow(nextBtn, 220);
      goTo(currentIndex + 1, true);
    });
    track.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', function () { goTo(currentIndex, false); });
    document.addEventListener('cards:refresh', function () { goTo(currentIndex, false); syncFromScroll(); });

    updateUI();
    goTo(0, false);
  });
}

function initProductPopup() {
  var overlay = document.getElementById('productOverlay');
  if (!overlay) return;

  var mapStage = document.getElementById('productOverlayMap');
  var detailStage = document.getElementById('productOverlayDetail');
  var closeBtn = document.getElementById('productOverlayClose');
  var backBtn = document.getElementById('productOverlayBack');
  var pan = document.getElementById('productOverlayPan');
  var scene = document.getElementById('productOverlayScene');
  var sceneImage = document.getElementById('productOverlaySceneImage');
  var mobileNav = document.getElementById('productOverlayMobileNav');
  var mobileDotsWrap = document.getElementById('productOverlayMobileDots');
  var mobilePrev = document.getElementById('productOverlayMobilePrev');
  var mobileNext = document.getElementById('productOverlayMobileNext');
  var breadcrumb = document.getElementById('productOverlayBreadcrumb');
  var breadcrumbCollection = document.getElementById('productOverlayBreadcrumbCollection');
  var breadcrumbProduct = document.getElementById('productOverlayBreadcrumbProduct');
  var detailTitle = document.getElementById('productOverlayTitle');
  var detailMedia = document.getElementById('productOverlayDetailMedia');
  var featureList = document.getElementById('productOverlayFeatureList');
  var detailMobileNav = document.getElementById('productOverlayDetailMobileNav');
  var detailMobileDotsWrap = document.getElementById('productOverlayDetailMobileDots');
  var detailMobilePrev = document.getElementById('productOverlayDetailMobilePrev');
  var detailMobileNext = document.getElementById('productOverlayDetailMobileNext');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-product-popup]'));
  if (!pan || !scene || !sceneImage) return;

  var DATA = createProductOverlayData();

  var currentCollection = DEFAULT_COLLECTION;
  var currentCollectionLabel = null;
  var activeHotspotCard = null;
  var lastFocusedTrigger = null;
  var mobileStops = [0];
  var mobileDots = [];
  var mobileIndex = 0;
  var detailFeatureDots = [];
  var detailFeatureStops = [];
  var detailFeatureIndex = 0;
  var hotspotHideTimer = null;
  var backReturnHandler = null;
  var hotspotPreview = document.createElement('article');
  hotspotPreview.className = 'product-hotspot-card';
  hotspotPreview.hidden = true;
  scene.appendChild(hotspotPreview);

  function collectionHasMap(collectionKey) {
    var entry = DATA[collectionKey];
    if (!entry || !entry.sceneImage) return false;
    var hotspots = Array.isArray(entry.hotspots) ? entry.hotspots : [];
    return hotspots.some(function (item) {
      return typeof item.x === 'number' && typeof item.y === 'number';
    });
  }

  function isMobilePopupMode() {
    return window.matchMedia('(max-width: 798px)').matches;
  }

  function setStage(stage) {
    if (stage === 'detail' || !collectionHasMap(currentCollection)) {
      detailStage.hidden = false;
      mapStage.hidden = true;
      updateDetailFeatureGeometry();
      return;
    }
    detailStage.hidden = true;
    mapStage.hidden = false;
    if (detailMobileNav) detailMobileNav.hidden = true;
  }

  function closeOverlay(options) {
    var opts = options || {};
    var activeEl = document.activeElement;
    if (activeEl && overlay.contains(activeEl) && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }

    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    if (!opts.keepBodyOverlayClass) {
      document.body.classList.remove('has-overlay');
    }
    hidePreview(true);
    setStage('map');
    if (!opts.keepBackReturnHandler) {
      backReturnHandler = null;
    }

    if (!opts.skipFocusRestore && lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus({ preventScroll: true });
    }
  }

  function buildMobileStops() {
    if (!isMobilePopupMode()) {
      mobileStops = [0];
      mobileIndex = 0;
      renderMobileDots();
      return;
    }

    var max = Math.max(0, pan.scrollWidth - pan.clientWidth);
    if (max <= 1) {
      mobileStops = [0];
      mobileIndex = 0;
      renderMobileDots();
      return;
    }

    mobileStops = [0, max / 2, max];
    syncMobileNav();
    renderMobileDots();
  }

  function renderMobileDots() {
    if (!mobileDotsWrap) return;
    mobileDotsWrap.innerHTML = '';
    mobileDots = mobileStops.map(function (_, index) {
      var dot = document.createElement('span');
      dot.className = 'product-overlay-mobile-dot' + (index === mobileIndex ? ' is-active' : '');
      mobileDotsWrap.appendChild(dot);
      return dot;
    });
    updateMobileArrows();
  }

  function updateMobileArrows() {
    if (!mobilePrev || !mobileNext) return;
    mobilePrev.disabled = mobileIndex <= 0;
    mobileNext.disabled = mobileIndex >= mobileStops.length - 1;
  }

  function syncMobileNav() {
    if (!mobileStops.length) return;
    var left = pan.scrollLeft;
    var closestIndex = 0;
    var closestDist = Number.POSITIVE_INFINITY;
    mobileStops.forEach(function (stop, index) {
      var dist = Math.abs(stop - left);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = index;
      }
    });
    mobileIndex = closestIndex;
    mobileDots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === mobileIndex);
    });
    updateMobileArrows();
  }

  function goToMobileStop(index, smooth) {
    if (!mobileStops.length) return;
    mobileIndex = Math.max(0, Math.min(index, mobileStops.length - 1));
    pan.scrollTo({ left: mobileStops[mobileIndex], behavior: smooth ? 'smooth' : 'auto' });
    syncMobileNav();
  }

  function updateMobileGeometry() {
    if (!collectionHasMap(currentCollection)) return;
    if (!isMobilePopupMode()) {
      scene.style.width = '';
      pan.scrollLeft = 0;
      mobileStops = [0];
      mobileIndex = 0;
      renderMobileDots();
      return;
    }

    var targetWidth = Math.round((pan.clientHeight * 1288) / 701);
    var finalWidth = Math.max(targetWidth, pan.clientWidth);
    scene.style.width = finalWidth + 'px';
    buildMobileStops();
  }

  function updateDetailFeatureArrows() {
    if (!detailMobilePrev || !detailMobileNext) return;
    detailMobilePrev.disabled = detailFeatureIndex <= 0;
    detailMobileNext.disabled = detailFeatureIndex >= detailFeatureStops.length - 1;
  }

  function renderDetailFeatureDots() {
    if (!detailMobileDotsWrap) return;
    detailMobileDotsWrap.innerHTML = '';
    detailFeatureDots = detailFeatureStops.map(function (_, index) {
      var dot = document.createElement('span');
      dot.className = 'product-overlay-mobile-dot' + (index === detailFeatureIndex ? ' is-active' : '');
      detailMobileDotsWrap.appendChild(dot);
      return dot;
    });
    updateDetailFeatureArrows();
  }

  function syncDetailFeatureNav() {
    if (!detailFeatureStops.length) return;
    var left = featureList.scrollLeft;
    var closestIndex = 0;
    var closestDist = Number.POSITIVE_INFINITY;

    detailFeatureStops.forEach(function (stop, index) {
      var dist = Math.abs(stop - left);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = index;
      }
    });

    detailFeatureIndex = closestIndex;
    detailFeatureDots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === detailFeatureIndex);
    });
    updateDetailFeatureArrows();
  }

  function goToDetailFeature(index, smooth) {
    if (!detailFeatureStops.length) return;
    detailFeatureIndex = Math.max(0, Math.min(index, detailFeatureStops.length - 1));
    featureList.scrollTo({ left: detailFeatureStops[detailFeatureIndex], behavior: smooth ? 'smooth' : 'auto' });
    syncDetailFeatureNav();
  }

  function updateDetailFeatureGeometry() {
    if (!detailMobileNav || !detailMobileDotsWrap || !featureList) return;

    if (!isMobilePopupMode() || detailStage.hidden) {
      detailMobileNav.hidden = true;
      detailFeatureStops = [];
      detailFeatureDots = [];
      return;
    }

    var detailItems = Array.prototype.slice.call(featureList.querySelectorAll('.product-overlay-feature-item'));
    if (!detailItems.length) {
      detailMobileNav.hidden = true;
      detailFeatureStops = [];
      detailFeatureDots = [];
      return;
    }

    detailMobileNav.hidden = false;
    var max = Math.max(0, featureList.scrollWidth - featureList.clientWidth);
    detailFeatureStops = detailItems.map(function (item) {
      var stop = item.offsetLeft - (featureList.clientWidth - item.offsetWidth) / 2;
      return clamp(stop, 0, max);
    });
    detailFeatureIndex = 0;
    renderDetailFeatureDots();
    goToDetailFeature(0, false);
  }

  function openOverlay(collection) {
    lastFocusedTrigger = document.activeElement;
    currentCollection = resolveOverlayCollectionKey(DATA, collection);
    backReturnHandler = null;
    if (!collectionHasMap(currentCollection)) {
      var entry = DATA[currentCollection];
      if (entry && Array.isArray(entry.hotspots) && entry.hotspots.length) {
        openOverlayDetail(currentCollection, entry.hotspots[0]);
      }
      return;
    }
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-overlay');
    setCollection(currentCollection);
    setStage('map');
    updateMobileGeometry();
    goToMobileStop(0, false);
  }

  function openOverlayDetail(collection, item, meta) {
    lastFocusedTrigger = document.activeElement;
    currentCollection = resolveOverlayCollectionKey(DATA, collection);
    currentCollectionLabel = meta && meta.collectionLabel ? meta.collectionLabel : null;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-overlay');
    setCollection(currentCollection);
    openDetail(item);
  }

  function hidePreview(immediate) {
    if (hotspotHideTimer) {
      window.clearTimeout(hotspotHideTimer);
      hotspotHideTimer = null;
    }
    hotspotPreview.classList.remove('is-visible');
    if (immediate) {
      hotspotPreview.hidden = true;
      hotspotPreview.innerHTML = '';
    } else {
      hotspotHideTimer = window.setTimeout(function () {
        hotspotPreview.hidden = true;
        hotspotPreview.innerHTML = '';
      }, 190);
    }
    activeHotspotCard = null;
    var activeHotspots = scene.querySelectorAll('.product-hotspot.is-active');
    activeHotspots.forEach(function (button) { button.classList.remove('is-active'); });
  }

  function buildSwatches(item) {
    var source = Array.isArray(item.swatches) ? item.swatches : [];
    var colors = source.map(function (entry, index) {
      if (typeof entry === 'string') {
        return { color: entry, active: index === 0 };
      }
      return {
        color: entry && entry.color ? entry.color : '#c7c7c0',
        active: Boolean(entry && entry.active)
      };
    });

    if (!colors.some(function (sw) { return sw.active; }) && colors.length) {
      colors[0].active = true;
    }

    return colors;
  }

  function featureFallbackDescription(title) {
    return 'Informacao adicional sobre ' + title.toLowerCase() + '.';
  }

  function normalizeFeature(feature, item) {
    if (typeof feature === 'string') {
      return {
        title: feature,
        description: featureFallbackDescription(feature),
        media: {
          type: 'image',
          src: item.image,
          alt: item.title
        }
      };
    }

    return {
      title: feature && feature.title ? feature.title : '',
      description: feature && feature.description ? feature.description : featureFallbackDescription(feature && feature.title ? feature.title : item.title),
      media: feature && feature.media ? feature.media : {
        type: 'image',
        src: item.image,
        alt: item.title
      }
    };
  }

  function renderDetailMedia(media, fallbackAlt, fitMode) {
    if (!detailMedia) return;
    detailMedia.innerHTML = '';
    detailMedia.classList.toggle('is-contain', fitMode === 'contain');

    var currentMedia = media || {};
    var type = currentMedia.type === 'video' ? 'video' : 'image';

    if (type === 'video') {
      var video = document.createElement('video');
      video.className = 'product-overlay-detail-media-video';
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      if (currentMedia.poster) video.poster = currentMedia.poster;
      var source = document.createElement('source');
      source.src = currentMedia.src || '';
      source.type = currentMedia.mime || 'video/mp4';
      video.appendChild(source);
      detailMedia.appendChild(video);
      return;
    }

    var image = document.createElement('img');
    image.className = 'product-overlay-detail-media-image';
    image.src = currentMedia.src || '';
    image.alt = currentMedia.alt || fallbackAlt || '';
    detailMedia.appendChild(image);
  }

  function showPreview(item, hotspotBtn) {
    if (hotspotHideTimer) {
      window.clearTimeout(hotspotHideTimer);
      hotspotHideTimer = null;
    }
    activeHotspotCard = item;
    hotspotPreview.classList.remove('is-visible');
    hotspotPreview.innerHTML = '';
    if (item.badge) {
      var badge = document.createElement('span');
      badge.className = 'product-hotspot-badge';
      var badgeIcon = document.createElement('img');
      badgeIcon.src = './assets/img/star.svg';
      badgeIcon.alt = '';
      badgeIcon.className = 'badge-star';
      badgeIcon.setAttribute('aria-hidden', 'true');
      badge.appendChild(badgeIcon);
      badge.appendChild(document.createTextNode(' ' + item.badge));
      hotspotPreview.appendChild(badge);
    }

    var image = document.createElement('img');
    image.className = 'product-hotspot-image';
    image.src = item.image;
    image.alt = item.title;
    hotspotPreview.appendChild(image);

    var content = document.createElement('div');
    content.className = 'product-hotspot-content';
    var title = document.createElement('p');
    title.className = 'product-hotspot-title';
    title.textContent = item.title;
    content.appendChild(title);

    var swatches = document.createElement('div');
    swatches.className = 'product-hotspot-swatches';
    buildSwatches(item).forEach(function (swatch) {
      var sw = document.createElement('span');
      sw.className = 'product-hotspot-swatch';
      sw.style.setProperty('--swatch-color', swatch.color);
      if (swatch.active) sw.classList.add('is-active');
      swatches.appendChild(sw);
    });
    content.appendChild(swatches);
    hotspotPreview.appendChild(content);

    hotspotPreview.hidden = false;
    window.requestAnimationFrame(function () {
      hotspotPreview.classList.add('is-visible');
    });
    hotspotBtn.classList.add('is-active');

    var cardWidth = hotspotPreview.offsetWidth;
    var cardHeight = hotspotPreview.offsetHeight;
    var left = hotspotBtn.offsetLeft + hotspotBtn.offsetWidth * 0.8;
    if (left + cardWidth > scene.clientWidth - 12) {
      left = hotspotBtn.offsetLeft - cardWidth - 8;
    }
    left = clamp(left, 12, scene.clientWidth - cardWidth - 12);

    var top = hotspotBtn.offsetTop - cardHeight / 2;
    top = clamp(top, 12, scene.clientHeight - cardHeight - 12);
    hotspotPreview.style.left = left + 'px';
    hotspotPreview.style.top = top + 'px';
  }

  function openDetail(item) {
    detailTitle.textContent = item.title;
    if (breadcrumbCollection && breadcrumbProduct) {
      breadcrumbCollection.textContent = currentCollectionLabel || DATA[currentCollection].label;
      breadcrumbProduct.textContent = item.title;
    } else if (breadcrumb) {
      breadcrumb.textContent = (currentCollectionLabel || DATA[currentCollection].label) + ' / ' + item.title;
    }
    var normalizedFeatures = (Array.isArray(item.features) ? item.features : []).map(function (feature) {
      return normalizeFeature(feature, item);
    });

    featureList.innerHTML = '';
    if (!normalizedFeatures.length) {
      renderDetailMedia({ type: 'image', src: item.image, alt: item.title }, item.title, 'contain');
    } else {
      var activeFeatureIndex = -1;
      var featureNodes = [];

      normalizedFeatures.forEach(function (feature, index) {
        var li = document.createElement('li');
        li.className = 'product-overlay-feature-item';

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'product-overlay-feature-trigger';
        trigger.setAttribute('aria-expanded', 'false');

        var icon = document.createElement('span');
        icon.className = 'product-overlay-feature-icon';
       icon.innerHTML = '<img src="./assets/img/plus.svg" alt="" class="product-overlay-feature-icon-plus" aria-hidden="true">';
        trigger.appendChild(icon);

        var label = document.createElement('span');
        label.className = 'product-overlay-feature-label';
        label.textContent = feature.title;
        trigger.appendChild(label);

        var description = document.createElement('p');
        description.className = 'product-overlay-feature-description';
        description.textContent = feature.description;

        li.addEventListener('click', function () {
          var isClosing = activeFeatureIndex === index;
          if (isClosing) {
            li.classList.add('no-close-transition');
          }
          activeFeatureIndex = isClosing ? -1 : index;
          featureNodes.forEach(function (node, nodeIndex) {
            var isActive = nodeIndex === activeFeatureIndex;
            node.classList.toggle('is-active', isActive);
            node.querySelector('.product-overlay-feature-trigger').setAttribute('aria-expanded', isActive ? 'true' : 'false');
            var nodeIcon = node.querySelector('.product-overlay-feature-icon');
            if (isActive) {
              nodeIcon.innerHTML = '<img src="./assets/img/close.svg" alt="" class="product-overlay-feature-icon-close" aria-hidden="true">';
            } else {
             nodeIcon.innerHTML = '<img src="./assets/img/plus.svg" alt="" class="product-overlay-feature-icon-plus" aria-hidden="true">';
            }
          });
          if (activeFeatureIndex >= 0) {
            var activeFeature = normalizedFeatures[activeFeatureIndex];
            var fitMode = activeFeature.title && activeFeature.title.toLowerCase() === 'details' ? 'contain' : 'cover';
            renderDetailMedia(activeFeature.media, item.title, fitMode);
            if (isMobilePopupMode()) {
              goToDetailFeature(activeFeatureIndex, true);
            }
          } else {
            renderDetailMedia({ type: 'image', src: item.image, alt: item.title }, item.title, 'contain');
          }
          if (isClosing) {
            window.setTimeout(function () {
              li.classList.remove('no-close-transition');
            }, 30);
          }
        });

        li.appendChild(trigger);
        li.appendChild(description);
        featureList.appendChild(li);
        featureNodes.push(li);
      });

      var relatedNode = buildRelatedListItem(item);
      if (relatedNode) {
        featureList.appendChild(relatedNode);
      }

      featureNodes.forEach(function (node) {
        node.classList.remove('is-active');
        node.querySelector('.product-overlay-feature-trigger').setAttribute('aria-expanded', 'false');
        node.querySelector('.product-overlay-feature-icon').innerHTML = '<img src="./assets/img/plus.svg" alt="" class="product-overlay-feature-icon-plus" aria-hidden="true">';
      });
      renderDetailMedia({ type: 'image', src: item.image, alt: item.title }, item.title, 'contain');
    }

    hidePreview(true);
    setStage('detail');
  }

  function buildRelatedListItem(item) {
    if (!item || !item.related) return null;
    var collectionData = DATA[currentCollection];
    if (!collectionData || !Array.isArray(collectionData.hotspots)) return null;
    var target = collectionData.hotspots.find(function (entry) {
      return entry.title === item.related;
    });
    if (!target) return null;

    var li = document.createElement('li');
    li.className = 'product-overlay-feature-item';

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'product-overlay-feature-trigger';
    trigger.setAttribute('aria-expanded', 'false');

    var icon = document.createElement('span');
    icon.className = 'product-overlay-feature-icon';
    icon.innerHTML = '<img src="./assets/img/plus.svg" alt="" class="product-overlay-feature-icon-plus" aria-hidden="true">';
    trigger.appendChild(icon);

    var label = document.createElement('span');
    label.className = 'product-overlay-feature-label';
    label.textContent = item.related;
    trigger.appendChild(label);

    trigger.addEventListener('click', function () {
      openDetail(target);
    });

    li.appendChild(trigger);
    return li;
  }

  function renderHotspots() {
    var oldHotspots = scene.querySelectorAll('.product-hotspot');
    oldHotspots.forEach(function (node) { node.remove(); });
    hidePreview();

    var collectionData = DATA[currentCollection];
    if (!collectionHasMap(currentCollection)) return;
    sceneImage.src = collectionData.sceneImage;
    collectionData.hotspots.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'product-hotspot';
      button.style.setProperty('--x', item.x + '%');
      button.style.setProperty('--y', item.y + '%');
      button.setAttribute('aria-label', 'Open details for ' + item.title);

      if (!isMobilePopupMode()) {
        button.addEventListener('mouseenter', function () { showPreview(item, button); });
        button.addEventListener('focus', function () { showPreview(item, button); });
        button.addEventListener('mouseleave', function () {
          button.classList.remove('is-active');
          if (activeHotspotCard === item) hidePreview();
        });
        button.addEventListener('blur', function () {
          button.classList.remove('is-active');
          if (activeHotspotCard === item) hidePreview();
        });
      }
      button.addEventListener('click', function () { openDetail(item); });

      scene.appendChild(button);
    });
  }

  function setCollection(collection) {
    currentCollection = resolveOverlayCollectionKey(DATA, collection);
    renderHotspots();
  }

  triggers.forEach(function (trigger) {
    bindActivatable(trigger, function () {
      var collection = trigger.getAttribute('data-collection');
      var itemTitle = trigger.getAttribute('data-item-title');
      if (itemTitle) {
        var resolvedCollection = resolveOverlayCollectionKey(DATA, collection);
        var collectionData = DATA[resolvedCollection];
        if (collectionData && Array.isArray(collectionData.hotspots)) {
          var match = collectionData.hotspots.find(function (item) {
            return item && item.title === itemTitle;
          });
          if (match) {
            openOverlayDetail(resolvedCollection, match);
            return;
          }
        }
      }
      openOverlay(collection);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (!detailStage.hidden && typeof backReturnHandler === 'function') {
        var returnHandler = backReturnHandler;
        backReturnHandler = null;
        closeOverlay({
          skipFocusRestore: true
        });
        returnHandler();
        return;
      }
      if (collectionHasMap(currentCollection)) {
        setStage('map');
      } else {
        closeOverlay();
      }
    });
  }

  if (mobilePrev) {
    mobilePrev.addEventListener('click', function () {
      flashArrow(mobilePrev, 220);
      goToMobileStop(mobileIndex - 1, true);
    });
  }

  if (mobileNext) {
    mobileNext.addEventListener('click', function () {
      flashArrow(mobileNext, 220);
      goToMobileStop(mobileIndex + 1, true);
    });
  }

  if (detailMobilePrev) {
    detailMobilePrev.addEventListener('click', function () {
      flashArrow(detailMobilePrev, 220);
      goToDetailFeature(detailFeatureIndex - 1, true);
    });
  }

  if (detailMobileNext) {
    detailMobileNext.addEventListener('click', function () {
      flashArrow(detailMobileNext, 220);
      goToDetailFeature(detailFeatureIndex + 1, true);
    });
  }

  overlay.addEventListener('click', function (event) {
    if (event.target.closest('[data-overlay-close]')) closeOverlay();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeOverlay();
  });

  pan.addEventListener('scroll', function () {
    if (!isMobilePopupMode()) return;
    syncMobileNav();
  }, { passive: true });

  featureList.addEventListener('scroll', function () {
    if (!isMobilePopupMode() || detailStage.hidden) return;
    syncDetailFeatureNav();
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (overlay.hidden) return;
    updateMobileGeometry();
    updateDetailFeatureGeometry();
  });

  scene.addEventListener('mouseleave', hidePreview);
  if (mobileNav) renderMobileDots();
  window.openProductOverlayDetail = openOverlayDetail;
  window.setProductOverlayBackTarget = function (handler) {
    backReturnHandler = typeof handler === 'function' ? handler : null;
  };
}

function initBestSellersPopup() {
  var overlay = document.getElementById('bestSellersOverlay');
  if (!overlay) return;

  var closeBtn = document.getElementById('bestSellersOverlayClose');
  var title = document.getElementById('bestSellersOverlayTitle');
  var subtitle = document.getElementById('bestSellersOverlaySubtitle');
  var grid = document.getElementById('bestSellersOverlayGrid');
  var quote = document.getElementById('bestSellersOverlayQuote');
  var badges = document.getElementById('bestSellersOverlayBadges');
  var mobileNav = document.getElementById('bestSellersOverlayMobileNav');
  var mobileDots = document.getElementById('bestSellersOverlayMobileDots');
  var mobilePrev = document.getElementById('bestSellersOverlayMobilePrev');
  var mobileNext = document.getElementById('bestSellersOverlayMobileNext');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-best-sellers-popup]'));
  if (!grid || !triggers.length) return;
  var activeCollection = DEFAULT_COLLECTION;
  var mobileIndex = 0;
  var mobileStops = [];

  var DATA = createBestSellersData();
  var BADGES = BEST_SELLERS_BADGES;

  var lastFocusedTrigger = null;

  function isMobileBestSellersMode() {
    return window.matchMedia('(max-width: 798px)').matches;
  }

  function renderMobileDots() {
    if (!mobileDots) return;
    mobileDots.innerHTML = '';
    mobileStops.forEach(function (_, index) {
      var dot = document.createElement('span');
      dot.className = 'best-sellers-overlay-mobile-dot' + (index === mobileIndex ? ' is-active' : '');
      mobileDots.appendChild(dot);
    });
  }

  function updateMobileButtons() {
    if (!mobilePrev || !mobileNext) return;
    var hasStops = mobileStops.length > 1;
    mobilePrev.disabled = !hasStops || mobileIndex <= 0;
    mobileNext.disabled = !hasStops || mobileIndex >= mobileStops.length - 1;
  }

  function computeMobileStops() {
    if (!isMobileBestSellersMode()) {
      mobileStops = [];
      mobileIndex = 0;
      if (mobileNav) mobileNav.style.display = 'none';
      if (mobileDots) mobileDots.innerHTML = '';
      updateMobileButtons();
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.best-sellers-overlay-item'));
    var maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
    mobileStops = cards.map(function (card) {
      var target = card.offsetLeft - ((grid.clientWidth - card.offsetWidth) / 2);
      return Math.max(0, Math.min(target, maxScroll));
    });

    if (!mobileStops.length) mobileStops = [0];
    mobileIndex = Math.max(0, Math.min(mobileIndex, mobileStops.length - 1));
    if (mobileNav) mobileNav.style.display = 'flex';
    renderMobileDots();
    updateMobileButtons();
  }

  function syncMobileFromScroll() {
    if (!isMobileBestSellersMode() || !mobileStops.length) return;
    var left = grid.scrollLeft;
    var best = 0;
    var bestDistance = Math.abs(mobileStops[0] - left);
    for (var i = 1; i < mobileStops.length; i += 1) {
      var distance = Math.abs(mobileStops[i] - left);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    }
    if (best !== mobileIndex) {
      mobileIndex = best;
      renderMobileDots();
      updateMobileButtons();
    }
  }

  function goToMobileIndex(nextIndex, smooth) {
    if (!isMobileBestSellersMode() || !mobileStops.length) return;
    mobileIndex = Math.max(0, Math.min(nextIndex, mobileStops.length - 1));
    grid.scrollTo({
      left: mobileStops[mobileIndex],
      behavior: smooth ? 'smooth' : 'auto'
    });
    renderMobileDots();
    updateMobileButtons();
  }

  function closeOverlay() {
    var activeEl = document.activeElement;
    if (activeEl && overlay.contains(activeEl) && typeof activeEl.blur === 'function') {
      activeEl.blur();
    }

    overlay.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    document.body.classList.remove('has-overlay');
    if (mobileNav) mobileNav.style.display = 'none';

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus({ preventScroll: true });
    }
  }

  function openOverlay(collection) {
    activeCollection = DATA[collection] ? collection : DEFAULT_COLLECTION;
    var data = DATA[activeCollection];
    lastFocusedTrigger = document.activeElement;

    subtitle.textContent = data.label;
    quote.textContent = data.quote;

    grid.innerHTML = '';
    data.items.forEach(function (item) {
      var card = document.createElement('article');
      card.className = 'best-sellers-overlay-item';
      card.setAttribute('aria-label', 'Open details for ' + item.name);

      var name = document.createElement('h4');
      name.className = 'best-sellers-overlay-item-title font-serif';
      name.textContent = item.name;

      var media = document.createElement('div');
      media.className = 'best-sellers-overlay-item-media';

      var image = document.createElement('img');
      image.src = item.image;
      image.alt = item.name;
      media.appendChild(image);

      card.appendChild(name);
      card.appendChild(media);
      grid.appendChild(card);

      var openDetail = function () {
        if (typeof window.openProductOverlayDetail !== 'function') return;
        var payload = item.detail || { title: item.name, image: item.image, swatches: [], features: [] };
        if (typeof window.setProductOverlayBackTarget === 'function') {
          window.setProductOverlayBackTarget(function () {
            openOverlay(activeCollection);
          });
        }
        closeOverlay();
        window.openProductOverlayDetail(activeCollection, payload);
      };

      bindActivatable(card, openDetail);
    });

    badges.innerHTML = '';
    BADGES.forEach(function (badge) {
      var el = document.createElement('span');
      el.className = 'best-sellers-overlay-badge';
      el.innerHTML = '<img src="' + badge.icon + '" alt="" aria-hidden="true"><span>' + badge.label + '</span>';
      badges.appendChild(el);
    });

    title.textContent = 'Best Sellers';
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-overlay');

    window.requestAnimationFrame(function () {
      computeMobileStops();
      goToMobileIndex(0, false);
      syncMobileFromScroll();
    });
  }

  triggers.forEach(function (trigger) {
    bindActivatable(trigger, function () {
      openOverlay(trigger.getAttribute('data-collection'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

  if (mobilePrev) {
    mobilePrev.addEventListener('click', function () {
      flashArrow(mobilePrev, 180);
      goToMobileIndex(mobileIndex - 1, true);
    });
  }

  if (mobileNext) {
    mobileNext.addEventListener('click', function () {
      flashArrow(mobileNext, 180);
      goToMobileIndex(mobileIndex + 1, true);
    });
  }

  overlay.addEventListener('click', function (event) {
    if (event.target.closest('[data-best-overlay-close]')) closeOverlay();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeOverlay();
  });

  grid.addEventListener('scroll', function () {
    if (!isMobileBestSellersMode()) return;
    syncMobileFromScroll();
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (overlay.hidden) return;
    var previousIndex = mobileIndex;
    computeMobileStops();
    goToMobileIndex(previousIndex, false);
  });
}

function initMiniPots() {
  var minis = Array.prototype.slice.call(document.querySelectorAll('.pots-mini[data-item-title][data-collection]'));
  if (!minis.length) return;

  var DATA = createProductOverlayData();

  function buildSwatches(item) {
    var source = Array.isArray(item.swatches) ? item.swatches : [];
    var colors = source.map(function (entry, index) {
      if (typeof entry === 'string') {
        return { color: entry, active: index === 0 };
      }
      return {
        color: entry && entry.color ? entry.color : '#c7c7c0',
        active: Boolean(entry && entry.active)
      };
    });
    if (!colors.some(function (sw) { return sw.active; }) && colors.length) {
      colors[0].active = true;
    }
    return colors;
  }

  minis.forEach(function (btn) {
    var collection = btn.getAttribute('data-collection');
    var title = btn.getAttribute('data-item-title');
    var collectionData = DATA[collection];
    if (!collectionData || !Array.isArray(collectionData.hotspots)) return;
    var item = collectionData.hotspots.find(function (entry) {
      return entry && entry.title === title;
    });
    if (!item) return;

    var grid = btn.closest('.pots-mini-grid');
    if (!grid) return;

    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'product-hotspot pots-mini-hotspot';
    dot.setAttribute('aria-label', 'Preview ' + item.title);
    btn.appendChild(dot);

    var card = document.createElement('article');
    card.className = 'product-hotspot-card pots-mini-preview';
    card.hidden = true;

    if (item.badge) {
      var badge = document.createElement('span');
      badge.className = 'product-hotspot-badge';
      var badgeIcon = document.createElement('img');
      badgeIcon.src = './assets/img/star.svg';
      badgeIcon.alt = '';
      badgeIcon.className = 'badge-star';
      badgeIcon.setAttribute('aria-hidden', 'true');
      badge.appendChild(badgeIcon);
      badge.appendChild(document.createTextNode(' ' + item.badge));
      card.appendChild(badge);
    }

    var image = document.createElement('img');
    image.className = 'product-hotspot-image';
    image.src = item.image;
    image.alt = item.title;
    card.appendChild(image);

    var content = document.createElement('div');
    content.className = 'product-hotspot-content';
    var titleEl = document.createElement('p');
    titleEl.className = 'product-hotspot-title';
    titleEl.textContent = item.title;
    content.appendChild(titleEl);

    var swatches = document.createElement('div');
    swatches.className = 'product-hotspot-swatches';
    buildSwatches(item).forEach(function (swatch) {
      var sw = document.createElement('span');
      sw.className = 'product-hotspot-swatch';
      sw.style.setProperty('--swatch-color', swatch.color);
      if (swatch.active) sw.classList.add('is-active');
      swatches.appendChild(sw);
    });
    content.appendChild(swatches);
    card.appendChild(content);

    grid.appendChild(card);

    function positionCard() {
      var gridRect = grid.getBoundingClientRect();
      var dotRect = dot.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var gap = 12;

      var left = dotRect.right - gridRect.left + gap;
      if (left + cardRect.width > gridRect.width) {
        left = dotRect.left - gridRect.left - cardRect.width - gap;
      }
      if (left < 0) left = 8;

      var top = dotRect.top - gridRect.top - (cardRect.height / 2) + (dotRect.height / 2);
      if (top + cardRect.height > gridRect.height) {
        top = gridRect.height - cardRect.height - 8;
      }
      if (top < 0) top = 8;

      card.style.left = left + 'px';
      card.style.top = top + 'px';
    }

    function showCard() {
      card.hidden = false;
      card.style.left = '-9999px';
      card.style.top = '-9999px';
      window.requestAnimationFrame(function () {
        positionCard();
        card.classList.add('is-visible');
      });
    }

    function hideCard() {
      card.classList.remove('is-visible');
      window.setTimeout(function () {
        card.hidden = true;
      }, 180);
    }

    dot.addEventListener('mouseenter', showCard);
    dot.addEventListener('focus', showCard);
    dot.addEventListener('mouseleave', hideCard);
    dot.addEventListener('blur', hideCard);
  });
}

function initImageHotspots() {
  var hotspots = Array.prototype.slice.call(document.querySelectorAll('.pots-image-hotspot[data-item-title][data-collection]'));
  if (!hotspots.length) return;

  var DATA = createProductOverlayData();
  var potsItems = APP_DATA.POTS_NEW2_DATA && APP_DATA.POTS_NEW2_DATA.items ? APP_DATA.POTS_NEW2_DATA.items : null;

  function buildSwatches(item) {
    var source = Array.isArray(item.swatches) ? item.swatches : [];
    var colors = source.map(function (entry, index) {
      if (typeof entry === 'string') {
        return { color: entry, active: index === 0 };
      }
      return {
        color: entry && entry.color ? entry.color : '#c7c7c0',
        active: Boolean(entry && entry.active)
      };
    });
    if (!colors.some(function (sw) { return sw.active; }) && colors.length) {
      colors[0].active = true;
    }
    return colors;
  }

  hotspots.forEach(function (hotspot) {
    var collection = hotspot.getAttribute('data-collection');
    var title = hotspot.getAttribute('data-item-title');
    var resolvedCollection = resolveOverlayCollectionKey(DATA, collection);
    var collectionData = DATA[resolvedCollection];
    if (!collectionData || !Array.isArray(collectionData.hotspots)) return;
    var item = collectionData.hotspots.find(function (entry) {
      return entry && entry.title === title;
    });
    if (!item) return;

    var grid = hotspot.closest('.pots-mini-grid');
    if (!grid) return;

    var card = document.createElement('article');
    card.className = 'product-hotspot-card pots-mini-preview';
    card.hidden = true;

    if (item.badge) {
      var badge = document.createElement('span');
      badge.className = 'product-hotspot-badge';
      var badgeIcon = document.createElement('img');
      badgeIcon.src = './assets/img/star.svg';
      badgeIcon.alt = '';
      badgeIcon.className = 'badge-star';
      badgeIcon.setAttribute('aria-hidden', 'true');
      badge.appendChild(badgeIcon);
      badge.appendChild(document.createTextNode(' ' + item.badge));
      card.appendChild(badge);
    }

    var image = document.createElement('img');
    image.className = 'product-hotspot-image';
    image.src = item.image;
    image.alt = item.title;
    card.appendChild(image);

    var content = document.createElement('div');
    content.className = 'product-hotspot-content';
    var titleEl = document.createElement('p');
    titleEl.className = 'product-hotspot-title';
    titleEl.textContent = item.title;
    content.appendChild(titleEl);

    var swatches = document.createElement('div');
    swatches.className = 'product-hotspot-swatches';
    buildSwatches(item).forEach(function (swatch) {
      var sw = document.createElement('span');
      sw.className = 'product-hotspot-swatch';
      sw.style.setProperty('--swatch-color', swatch.color);
      if (swatch.active) sw.classList.add('is-active');
      swatches.appendChild(sw);
    });
    content.appendChild(swatches);
    card.appendChild(content);

    grid.appendChild(card);

    function positionCard() {
      var gridRect = grid.getBoundingClientRect();
      var dotRect = hotspot.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var gap = 12;

      var left = dotRect.right - gridRect.left + gap;
      if (left + cardRect.width > gridRect.width) {
        left = dotRect.left - gridRect.left - cardRect.width - gap;
      }
      if (left < 0) left = 8;

      var top = dotRect.top - gridRect.top - (cardRect.height / 2) + (dotRect.height / 2);
      if (top + cardRect.height > gridRect.height) {
        top = gridRect.height - cardRect.height - 8;
      }
      if (top < 0) top = 8;

      card.style.left = left + 'px';
      card.style.top = top + 'px';
    }

    function showCard() {
      card.hidden = false;
      card.style.left = '-9999px';
      card.style.top = '-9999px';
      window.requestAnimationFrame(function () {
        positionCard();
        card.classList.add('is-visible');
      });
    }

    function hideCard() {
      card.classList.remove('is-visible');
      window.setTimeout(function () {
        card.hidden = true;
      }, 180);
    }

    hotspot.addEventListener('mouseenter', showCard);
    hotspot.addEventListener('focus', showCard);
    hotspot.addEventListener('mouseleave', hideCard);
    hotspot.addEventListener('blur', hideCard);

    hotspot.addEventListener('click', function (event) {
      event.preventDefault();
      if (typeof window.openProductOverlayDetail === 'function') {
        var collectionLabel = potsItems && potsItems[collection] && potsItems[collection].label ? potsItems[collection].label : null;
        if (typeof window.setProductOverlayBackTarget === 'function') {
          window.setProductOverlayBackTarget(function () {
            if (typeof window.setPotsNew2Tab === 'function') {
              window.setPotsNew2Tab(collection);
            }
          });
        }
        window.openProductOverlayDetail(resolvedCollection, item, { collectionLabel: collectionLabel });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initNavbarToggleLabel();
  initHeroTransition();
  initPotsNew2();
  initPotsNewTabs();
  initMobileCardControls();
  initProductPopup();
  initMiniPots();
  initImageHotspots();
  initBestSellersPopup();
});
