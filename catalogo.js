// WHATSAPP DA LOJA (55 + DDD + número, sem +, espaço ou traço)
const WHATSAPP = "5511989185874";

// PRODUTOS (edite como quiser)
const PRODUCTS = [
  {
    name: "Kit Panelas Ferro Fundido Esmaltado (4 peças)",
    category: "Ferro Fundido",
    highlights: ["Premium", "Alta retenção de calor", "Com tampas"],
    description:
      "Kit ideal para cozinha gourmet. Perfeito para cozimento lento, selar carnes e servir com estilo.",
    price: null,
    imageText: "Ferro Fundido"
  },
  {
    name: "Jogo de Panelas Antiaderente (11 peças)",
    category: "Antiaderente",
    highlights: ["Cozinha do dia a dia", "Fácil de limpar", "Kit completo"],
    description:
      "Kit completo para sua casa, com ótimo desempenho e praticidade.",
    price: null,
    imageText: "Antiaderente"
  },
  {
    name: "Conjunto de Utensílios de Silicone",
    category: "Utensílios",
    highlights: ["Não risca", "Resistente", "Ótimo para antiaderente"],
    description:
      "Utensílios ideais para preservar o revestimento das panelas.",
    price: null,
    imageText: "Silicone"
  }
];

const $ = (q) => document.querySelector(q);

function waLink(message) {
  const text = encodeURIComponent(message);

  // Mais compatível (desktop + mobile)
  return `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${text}`;
}

function uniqueCategories() {
  return Array.from(new Set(PRODUCTS.map(p => p.category))).sort();
}

function renderCategories() {
  const cats = uniqueCategories();
  const chips = $("#chips");
  const select = $("#categorySelect");

  chips.innerHTML = "";
  select.innerHTML = `<option value="all">Todas as categorias</option>`;

  const allChip = document.createElement("button");
  allChip.className = "chip active";
  allChip.textContent = "Todas";
  allChip.dataset.cat = "all";
  chips.appendChild(allChip);

  cats.forEach(cat => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = cat;
    b.dataset.cat = cat;
    chips.appendChild(b);

    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function matches(p, term, cat) {
  const t = term.trim().toLowerCase();
  const termOk = !t || (
    p.name.toLowerCase().includes(t) ||
    p.category.toLowerCase().includes(t) ||
    (p.highlights || []).join(" ").toLowerCase().includes(t)
  );
  const catOk = (cat === "all") || (p.category === cat);
  return termOk && catOk;
}

function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${text}`;
}

function renderGrid() {
  const term = $("#searchInput").value;
  const cat = $("#categorySelect").value;

  const list = PRODUCTS.filter(p => matches(p, term, cat));
  $("#count").textContent = `${list.length} produto(s)`;

  const grid = $("#grid");
  grid.innerHTML = "";

  list.forEach(p => {
    const msg = `Olá! Vim pelo catálogo da AGK HOME e tenho interesse no produto: ${p.name}. Pode me passar mais informações?`;
    const link = waLink(msg);

    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <div class="product__img">${p.imageText || "AGK HOME"}</div>
      <div class="product__body">
        <h3 class="product__title">${p.name}</h3>
        <div class="product__meta">
          <span class="tag">${p.category}</span>
          ${p.price ? `<span class="tag">${p.price}</span>` : `<span class="tag">Catálogo</span>`}
        </div>

        <div class="product__actions">
          <button type="button" data-details="${p.name}">Detalhes</button>

          <!-- LINK DIRETO (não depende de JS para abrir) -->
          <a class="primaryLink" href="${link}" target="_blank" rel="noopener">
            Pedir
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // só mantém o modal nos detalhes
  grid.querySelectorAll("[data-details]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.details));
  });
}


function buy(productName) {
  const msg = `Olá! Vim pelo catálogo da AGK HOME e tenho interesse no produto: ${productName}. Pode me passar mais informações?`;
  const link = waLink(msg);

  // Evita bloqueio de popup
  window.location.href = link;
}

function openModal(productName) {
  const p = PRODUCTS.find(x => x.name === productName);
  const body = $("#modalBody");

  body.innerHTML = `
    <h2 style="margin-top:0">${p.name}</h2>
    <p class="muted">Categoria: <strong>${p.category}</strong></p>
    <p>${p.description || ""}</p>
    <div style="display:flex; gap:10px; flex-wrap:wrap; margin:12px 0;">
      ${(p.highlights || []).map(h => `<span class="tag">${h}</span>`).join("")}
    </div>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <a class="btn btn--whats" href="${waLink(`Olá! Vim pelo catálogo da AGK HOME e tenho interesse no produto: ${p.name}. Pode me passar mais informações?`)}" target="_blank">
        Pedir no WhatsApp
      </a>
    </div>
  `;

  $("#modal").classList.add("show");
}

function closeModal() {
  $("#modal").classList.remove("show");
}

function syncWhatsButtons() {
  const msg = "Olá! Vim pelo catálogo da AGK HOME. Quero fazer um pedido.";
  const link = waLink(msg);

  const hero = $("#whatsHero");
  const foot = $("#whatsFooter");

  if (hero) hero.href = link;
  if (foot) foot.href = link;
}

function chipBehavior() {
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;

    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active");

    $("#categorySelect").value = b.dataset.cat;
    renderGrid();
  });
}

function init() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  renderCategories();
  syncWhatsButtons();
  chipBehavior();

  $("#searchInput").addEventListener("input", renderGrid);
  $("#categorySelect").addEventListener("change", renderGrid);

  const modalClose = $("#modalClose");
  const modalX = $("#modalX");
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalX) modalX.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  renderGrid();
}

init();
