"use strict";

const PRODUCTS = [
	{
		id: 1,
		name: "LumiBottle Pro 700ml",

		cat: "smart",
		category: "Smart Series",
		price: 1999,
		oldPrice: null,
		badge: "new",
		sku: "LB-PRO-700",
		image: "images/products/lumi700ml.png",
		emoji: "💧",
		bg: "#dbeeff",
		desc: "Our flagship smart bottle with 4-ring LED hydration alerts, Bluetooth tracking, and a 700ml double-wall stainless steel body. Pairs with the LumiBottle iOS & Android app.",
		featured: true,
	},
	{
		id: 2,
		name: "LumiBottle Slim 500ml",
		cat: "smart",
		category: "Smart Series",
		price: 1699,
		oldPrice: null,
		badge: null,
		sku: "LB-SLM-500",
		image: "images/products/lumi500ml.png",
		emoji: "🔵",
		bg: "#e8f4ff",
		desc: "Ultra-slim everyday carry. Single LED reminder ring, 500ml capacity — fits any bag or cup holder. Fully app compatible.",
		featured: true,
	},
	{
		id: 3,
		name: "LumiBottle Classic 1L",
		cat: "classic",
		category: "Classic Series",
		price: 1299,
		oldPrice: 1499,
		badge: "sale",
		sku: "LB-CLS-1L",
		image: "images/products/lumi1000ml.png",
		emoji: "⚪",
		bg: "#f0f4f8",
		desc: "No tech, no app — just premium double-wall insulation. Keeps cold 24h, hot 12h. 1 litre stainless steel body built to last.",
		featured: true,
	},
	{
		id: 4,
		name: "LumiBottle Kids 350ml",
		cat: "kids",
		category: "Kids Series",
		price: 999,
		oldPrice: null,
		badge: "new",
		sku: "LB-KID-350",
		emoji: "🌈",
		bg: "#fff5e8",
		desc: "BPA-free stainless body with fun glow colours. Easy straw lid, 350ml — perfect for school, sports, and play.",
		featured: false,
	},
	{
		id: 5,
		name: "Hydration Bundle",
		cat: "bundle",
		category: "Bundle",
		price: 3499,
		oldPrice: 3998,
		badge: "sale",
		sku: "LB-BND-001",
		emoji: "🎁",
		bg: "#e8f0ff",
		desc: "LumiBottle Pro + Slim + silicone straw set + cleaning brush + custom carry sleeve. Save ₱499 versus buying separately.",
		featured: true,
	},
	{
		id: 6,
		name: "Silicone Sleeve Cover",
		cat: "accessories",
		category: "Accessories",
		price: 299,
		oldPrice: null,
		badge: null,
		sku: "LB-ACC-SLV",
		emoji: "🧡",
		bg: "#fff0e8",
		desc: "Protective anti-slip silicone sleeve for all 700ml LumiBottle models. Available in 6 colours.",
		featured: false,
	},
	{
		id: 7,
		name: "LumiBottle Sport 800ml",
		cat: "smart",
		category: "Smart Series",
		price: 2199,
		oldPrice: null,
		badge: null,
		sku: "LB-SPT-800",
		emoji: "💪",
		bg: "#e8f4ff",
		desc: "Wide-mouth sport edition with 5-ring LED display, sweat-proof exterior, and loop carry handle. Built for serious athletes.",
		featured: false,
	},
	{
		id: 8,
		name: "Straw & Brush Kit",
		cat: "accessories",
		category: "Accessories",
		price: 199,
		oldPrice: null,
		badge: null,
		sku: "LB-ACC-KIT",
		emoji: "🧹",
		bg: "#f0f8ff",
		desc: "4 reusable stainless straws, 2 silicone tips, 1 bottle cleaning brush. Compatible with all LumiBottle sizes.",
		featured: false,
	},
];

const ORDERS_DATA = [
	{ id: "LB-20240001", status: "Shipped", eta: "March 20, 2024", step: 3 },
	{ id: "LB-20240002", status: "Processing", eta: "March 22, 2024", step: 2 },
	{ id: "LB-20240003", status: "Delivered", eta: "March 15, 2024", step: 4 },
];

let USERS = [
	{
		email: "admin@lumibottle.ph",
		password: "admin123",
		name: "Admin User",
		role: "admin",
		orders: [],
	},
	{
		email: "user@example.com",
		password: "user123",
		name: "Juan dela Cruz",
		role: "user",
		orders: [
			{
				id: "LB-20240001",
				date: "Mar 14, 2024",
				product: "LumiBottle Pro 700ml",
				total: "₱1,999",
				status: "Shipped",
			},
			{
				id: "LB-20240003",
				date: "Mar 10, 2024",
				product: "Classic 1L",
				total: "₱1,299",
				status: "Delivered",
			},
		],
	},
];

const INITIAL_REVIEWS = [
	{
		name: "Andrea K.",
		stars: 5,
		text: "The LED reminder changed my life. I hit my 2L goal daily without even thinking about it.",
		date: "Feb 28, 2024",
	},
	{
		name: "Ramon D.",
		stars: 5,
		text: "Got the whole office hooked. The app streaks made it competitive — everyone drinks more now.",
		date: "Mar 5, 2024",
	},
	{
		name: "Lyza C.",
		stars: 4,
		text: "Keeps my iced coffee cold all day. The glowing rings always spark a conversation.",
		date: "Mar 8, 2024",
	},
];

let cart = [];
let reviews = [...INITIAL_REVIEWS];
let currentUser = null;
let modalProd = null;
let modalQty = 1;
let revRating = 0;

const ptOverlay = document.getElementById("ptOverlay");

function navigate(page) {
	const current = document.querySelector(".page.active");
	const target = document.getElementById("page-" + page);
	if (!target || (current && current.id === "page-" + page)) return;

	if (page === "admin" && (!currentUser || currentUser.role !== "admin")) {
		showToast("⚠ Admin access required. Please sign in.");
		openAuthModal("login");
		return;
	}
	if (page === "orders" && !currentUser) {
		showToast("⚠ Please sign in to view orders.");
		openAuthModal("login");
		return;
	}

	ptOverlay.classList.remove("in", "out");
	void ptOverlay.offsetWidth;
	ptOverlay.classList.add("in");

	setTimeout(() => {
		if (current) current.classList.remove("active");
		target.classList.add("active");
		window.scrollTo({ top: 0 });

		document.querySelectorAll(".nl").forEach((a) => {
			a.classList.toggle("active", a.dataset.page === page);
		});

		ptOverlay.classList.remove("in");
		void ptOverlay.offsetWidth;
		ptOverlay.classList.add("out");

		observeReveals();
		closeHamburger();
		closeAccountDropdown();
	}, 250);
}

document.addEventListener("click", (e) => {
	const el = e.target.closest("[data-page]");
	if (
		el &&
		!el.closest(".admin-nav") &&
		!el.closest(".footer-col") &&
		el.tagName !== "BUTTON"
	) {
		navigate(el.dataset.page);
	} else if (
		el &&
		(el.closest(".admin-nav") ||
			el.closest(".footer-col") ||
			el.tagName === "BUTTON")
	) {
		if (!el.closest(".admin-nav")) navigate(el.dataset.page);
	}
});

document.querySelectorAll(".an-item[data-tab]").forEach((btn) => {
	btn.addEventListener("click", () => {
		document
			.querySelectorAll(".an-item")
			.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
		document
			.querySelectorAll(".admin-tab")
			.forEach((t) => t.classList.remove("active"));
		document.getElementById("tab-" + btn.dataset.tab)?.classList.add("active");
	});
});
document.querySelectorAll(".an-item[data-page]").forEach((btn) => {
	btn.addEventListener("click", () => navigate(btn.dataset.page));
});

document.querySelectorAll(".footer-col a[data-page]").forEach((a) => {
	a.addEventListener("click", () => navigate(a.dataset.page));
});

window.addEventListener(
	"scroll",
	() => {
		document
			.getElementById("navbar")
			.classList.toggle("scrolled", window.scrollY > 20);
	},
	{ passive: true },
);

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
function closeHamburger() {
	hamburger.classList.remove("open");
	navLinks.classList.remove("mopen");
}
hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("open");
	navLinks.classList.toggle("mopen");
});

let ro;
function observeReveals() {
	if (ro) ro.disconnect();
	ro = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("in");
					ro.unobserve(e.target);
				}
			});
		},
		{ threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
	);
	document
		.querySelectorAll(".page.active .reveal")
		.forEach((el) => ro.observe(el));
}
window.addEventListener("load", observeReveals);

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchToggle.addEventListener("click", (e) => {
	e.stopPropagation();
	searchPanel.classList.toggle("open");
	if (searchPanel.classList.contains("open"))
		setTimeout(() => searchInput.focus(), 50);
});
document.addEventListener("click", (e) => {
	if (!searchPanel.contains(e.target) && e.target !== searchToggle)
		searchPanel.classList.remove("open");
});
searchInput.addEventListener("input", () => {
	const q = searchInput.value.trim().toLowerCase();
	if (!q) {
		searchResults.innerHTML = "";
		return;
	}
	const hits = PRODUCTS.filter(
		(p) =>
			p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
	).slice(0, 5);
	searchResults.innerHTML = hits.length
		? hits
				.map(
					(p) =>
						`<div class="sri" data-id="${p.id}"><span>${p.name}</span><span class="sri-price">₱${p.price.toLocaleString()}</span></div>`,
				)
				.join("")
		: '<div class="sri" style="pointer-events:none">No results</div>';
});
searchResults.addEventListener("click", (e) => {
	const item = e.target.closest("[data-id]");
	if (!item) return;
	searchPanel.classList.remove("open");
	searchInput.value = "";
	searchResults.innerHTML = "";
	navigate("products");
	setTimeout(() => openModal(+item.dataset.id), 350);
});

const accountToggle = document.getElementById("accountToggle");
const accountDropdown = document.getElementById("accountDropdown");
function closeAccountDropdown() {
	accountDropdown.classList.remove("open");
}
accountToggle.addEventListener("click", (e) => {
	e.stopPropagation();
	accountDropdown.classList.toggle("open");
});
document.addEventListener("click", (e) => {
	if (!accountDropdown.contains(e.target) && e.target !== accountToggle)
		closeAccountDropdown();
});
document.getElementById("showLoginBtn").addEventListener("click", () => {
	closeAccountDropdown();
	openAuthModal("login");
});
document.getElementById("showRegisterBtn").addEventListener("click", () => {
	closeAccountDropdown();
	openAuthModal("register");
});
document.getElementById("goDashboardBtn").addEventListener("click", () => {
	closeAccountDropdown();
	navigate("admin");
});
document.getElementById("goOrdersBtn").addEventListener("click", () => {
	closeAccountDropdown();
	navigate("orders");
	renderOrders();
});
document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("adminLogoutBtn").addEventListener("click", () => {
	logout();
	navigate("home");
});

const authOverlay = document.getElementById("authOverlay");
const loginPanel = document.getElementById("loginPanel");
const registerPanel = document.getElementById("registerPanel");

function openAuthModal(panel = "login") {
	loginPanel.style.display = panel === "login" ? "block" : "none";
	registerPanel.style.display = panel === "register" ? "block" : "none";
	authOverlay.classList.add("open");
	document.body.style.overflow = "hidden";
}
function closeAuthModal() {
	authOverlay.classList.remove("open");
	document.body.style.overflow = "";
}

document.getElementById("authClose").addEventListener("click", closeAuthModal);
authOverlay.addEventListener("click", (e) => {
	if (e.target === authOverlay) closeAuthModal();
});

document.getElementById("toRegister").addEventListener("click", () => {
	loginPanel.style.display = "none";
	registerPanel.style.display = "block";
});
document.getElementById("toLogin").addEventListener("click", () => {
	registerPanel.style.display = "none";
	loginPanel.style.display = "block";
});

document.getElementById("loginBtn").addEventListener("click", () => {
	const email = document.getElementById("loginEmail").value.trim();
	const pass = document.getElementById("loginPass").value;
	const user = USERS.find((u) => u.email === email && u.password === pass);
	if (!user) {
		showToast("⚠ Invalid email or password.");
		return;
	}
	currentUser = user;
	updateAccountUI();
	closeAuthModal();
	showToast(`✦ Welcome back, ${user.name.split(" ")[0]}!`);
	if (user.role === "admin") {
		setTimeout(() => {
			showToast("Admin dashboard available in your account menu.");
		}, 1500);
	}
});

document.getElementById("registerBtn").addEventListener("click", () => {
	const fname = document.getElementById("regFname").value.trim();
	const lname = document.getElementById("regLname").value.trim();
	const email = document.getElementById("regEmail").value.trim();
	const pass = document.getElementById("regPass").value;
	if (!fname || !lname || !email || !pass) {
		showToast("⚠ Please fill in all fields.");
		return;
	}
	if (pass.length < 6) {
		showToast("⚠ Password must be at least 6 characters.");
		return;
	}
	if (USERS.find((u) => u.email === email)) {
		showToast("⚠ That email is already registered.");
		return;
	}
	const newUser = {
		email,
		password: pass,
		name: `${fname} ${lname}`,
		role: "user",
		orders: [],
	};
	USERS.push(newUser);
	currentUser = newUser;
	updateAccountUI();
	closeAuthModal();
	showToast(`✦ Welcome, ${fname}! Your account has been created.`);
});

function logout() {
	currentUser = null;
	updateAccountUI();
	showToast("You have been signed out.");
}

function updateAccountUI() {
	const out = document.getElementById("accountLoggedOut");
	const inn = document.getElementById("accountLoggedIn");
	if (currentUser) {
		out.style.display = "none";
		inn.style.display = "block";
		document.getElementById("adAvatar").textContent = currentUser.name
			.charAt(0)
			.toUpperCase();
		document.getElementById("adName").textContent = currentUser.name;
		document.getElementById("adRole").textContent =
			currentUser.role === "admin" ? "⚡ Administrator" : "Customer";
		document.getElementById("goDashboardBtn").style.display =
			currentUser.role === "admin" ? "flex" : "none";
	} else {
		out.style.display = "block";
		inn.style.display = "none";
	}
}

function buildCard(p, delay = 0) {
	const hasImg = typeof p.image !== "undefined";
	const media = hasImg
		? `<img src="${p.image}" alt="${p.name}" loading="lazy"/>`
		: `<div class="pc-placeholder" style="background:${p.bg}">
        <span>${p.emoji}</span>
        <small>images/products/${p.sku.toLowerCase()}.jpg</small>
       </div>`;
	const badge = p.badge
		? `<span class="pc-pill ${p.badge}">${p.badge === "new" ? "New" : "Sale"}</span>`
		: "";
	const price = p.oldPrice
		? `<span class="old">₱${p.oldPrice.toLocaleString()}</span> ₱${p.price.toLocaleString()}`
		: `₱${p.price.toLocaleString()}`;

	const card = document.createElement("div");
	card.className = "product-card";
	card.style.animationDelay = delay + "ms";
	card.innerHTML = `
    <div class="pc-media">${badge}${media}</div>
    <div class="pc-body">
      <div class="pc-cat">${p.category}</div>
      <div class="pc-name">${p.name}</div>
      <div class="pc-desc">${p.desc.substring(0, 80)}…</div>
      <div class="pc-footer">
        <div class="pc-price">${price}</div>
        <button class="pc-cart" data-cid="${p.id}" title="Add to cart">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
      </div>
    </div>`;
	card.addEventListener("click", (e) => {
		if (e.target.closest("[data-cid]")) {
			e.stopPropagation();
			addToCart(p.id, 1);
		} else openModal(p.id);
	});
	return card;
}

function renderGrid(list, el) {
	el.innerHTML = "";
	if (!list.length) {
		el.innerHTML =
			'<p style="color:var(--text-light);font-size:.87rem;padding:2rem 0;grid-column:1/-1">No products found.</p>';
		return;
	}
	list.forEach((p, i) => el.appendChild(buildCard(p, i * 45)));
}

function renderFeatured() {
	const g = document.getElementById("featuredGrid");
	if (g)
		renderGrid(
			PRODUCTS.filter((p) => p.featured),
			g,
		);
}

function renderProducts(cat = "all") {
	const g = document.getElementById("productsGrid");
	if (!g) return;
	renderGrid(
		cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat),
		g,
	);
}

document.getElementById("filterRow")?.addEventListener("click", (e) => {
	const btn = e.target.closest(".fb");
	if (!btn) return;
	document.querySelectorAll(".fb").forEach((b) => b.classList.remove("active"));
	btn.classList.add("active");
	renderProducts(btn.dataset.cat);
});

const STOCK = [89, 42, 7, 120, 23, 210, 56, 180];
const SSTATUS = ["in", "in", "low", "in", "low", "in", "in", "in"];
const SLABEL = [
	"In Stock",
	"In Stock",
	"Low Stock",
	"In Stock",
	"Low Stock",
	"In Stock",
	"In Stock",
	"In Stock",
];

function renderInventory(bodyId) {
	const b = document.getElementById(bodyId);
	if (!b) return;
	b.innerHTML = PRODUCTS.map(
		(p, i) => `
    <tr>
      <td>${p.name}</td>
      <td><code>${p.sku}</code></td>
      <td>${p.category}</td>
      ${bodyId === "adminInventoryBody" ? `<td>₱${p.price.toLocaleString()}</td>` : ""}
      <td>${STOCK[i]}</td>
      <td><span class="sp-${SSTATUS[i]}">${SLABEL[i]}</span></td>
    </tr>`,
	).join("");
}

function renderReviews() {
	const el = document.getElementById("reviewList");
	if (!el) return;
	el.innerHTML = reviews
		.map(
			(r) => `
    <div class="rev-item">
      <div class="rev-header">
        <div class="rev-reviewer">
          <div class="rev-av">${r.name.charAt(0)}</div>
          <div><div class="rev-name">${r.name}</div><div class="rev-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div></div>
        </div>
        <div class="rev-date">${r.date}</div>
      </div>
      <div class="rev-text">${r.text}</div>
    </div>`,
		)
		.join("");
}

const starRow = document.getElementById("starRow");
if (starRow) {
	starRow.querySelectorAll("span").forEach((s) => {
		s.addEventListener("click", () => {
			revRating = +s.dataset.v;
			starRow
				.querySelectorAll("span")
				.forEach((x, i) => x.classList.toggle("lit", i < revRating));
		});
		s.addEventListener("mouseenter", () =>
			starRow
				.querySelectorAll("span")
				.forEach((x, i) => x.classList.toggle("lit", i < +s.dataset.v)),
		);
		s.addEventListener("mouseleave", () =>
			starRow
				.querySelectorAll("span")
				.forEach((x, i) => x.classList.toggle("lit", i < revRating)),
		);
	});
}
document.getElementById("submitRevBtn")?.addEventListener("click", () => {
	const name = document.getElementById("revName")?.value.trim();
	const text = document.getElementById("revText")?.value.trim();
	if (!name || !text || !revRating) {
		showToast("⚠ Please fill in name, review, and select a rating.");
		return;
	}
	reviews.unshift({ name, stars: revRating, text, date: "Just now" });
	document.getElementById("revName").value = "";
	document.getElementById("revText").value = "";
	revRating = 0;
	starRow?.querySelectorAll("span").forEach((s) => s.classList.remove("lit"));
	renderReviews();
	showToast("⭐ Review submitted — thank you!");
});

const productOverlay = document.getElementById("productOverlay");
const productModal = document.getElementById("productModal");

function openModal(id) {
	const p = PRODUCTS.find((x) => x.id === id);
	if (!p) return;
	modalProd = p;
	modalQty = 1;

	const hasImg = typeof p.image !== "undefined";
	document.getElementById("pmMedia").innerHTML = hasImg
		? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>`
		: `<div class="pm-placeholder" style="background:${p.bg}"><span>${p.emoji}</span><small>images/products/${p.sku.toLowerCase()}.jpg</small></div>`;

	document.getElementById("pmCat").textContent = p.category;
	document.getElementById("pmTitle").textContent = p.name;
	document.getElementById("pmPrice").textContent =
		"₱" + p.price.toLocaleString();
	document.getElementById("pmDesc").textContent = p.desc;
	document.getElementById("pmNum").textContent = "1";

	productOverlay.classList.add("open");
	document.body.style.overflow = "hidden";
}
function closeModal() {
	productOverlay.classList.remove("open");
	document.body.style.overflow = "";
}
productOverlay.addEventListener("click", (e) => {
	if (e.target === productOverlay) closeModal();
});
document
	.getElementById("productModalClose")
	.addEventListener("click", closeModal);
document.getElementById("pmMinus").addEventListener("click", () => {
	if (modalQty > 1) {
		modalQty--;
		document.getElementById("pmNum").textContent = modalQty;
	}
});
document.getElementById("pmPlus").addEventListener("click", () => {
	modalQty++;
	document.getElementById("pmNum").textContent = modalQty;
});
document.getElementById("pmAddBtn").addEventListener("click", () => {
	if (modalProd) {
		addToCart(modalProd.id, modalQty);
		closeModal();
	}
});

function addToCart(id, qty = 1) {
	const ex = cart.find((x) => x.id === id);
	if (ex) ex.qty += qty;
	else {
		const p = PRODUCTS.find((x) => x.id === id);
		cart.push({ ...p, qty });
	}
	updateCartBadge();
	renderDrawer();
	showToast(`✦ ${PRODUCTS.find((x) => x.id === id)?.name} added to cart`);
}
function updateCartBadge() {
	const total = cart.reduce((s, i) => s + i.qty, 0);
	const badge = document.getElementById("cartBadge");
	badge.textContent = total;
	badge.classList.add("bump");
	setTimeout(() => badge.classList.remove("bump"), 300);
}
function renderDrawer() {
	const el = document.getElementById("drawerItems");
	if (!cart.length) {
		el.innerHTML = `<div class="drawer-empty"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your cart is empty</p></div>`;
		document.getElementById("drawerTotal").textContent = "₱0";
		return;
	}
	el.innerHTML = cart
		.map(
			(item) => `
    <div class="drawer-item">
      <div class="di-media" style="background:${item.bg}">${typeof item.image !== "undefined" ? `<img src="${item.image}" alt="${item.name}">` : item.emoji}</div>
      <div class="di-info">
        <div class="di-name">${item.name}</div>
        <div class="di-price">₱${(item.price * item.qty).toLocaleString()}</div>
        <div class="di-controls">
          <button class="di-qbtn" onclick="chQty(${item.id},-1)">−</button>
          <span class="di-qnum">${item.qty}</span>
          <button class="di-qbtn" onclick="chQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="di-rm" onclick="rmCart(${item.id})" title="Remove">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`,
		)
		.join("");
	const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
	document.getElementById("drawerTotal").textContent =
		"₱" + total.toLocaleString();
}
window.chQty = (id, d) => {
	const it = cart.find((x) => x.id === id);
	if (!it) return;
	it.qty += d;
	if (it.qty <= 0) cart = cart.filter((x) => x.id !== id);
	updateCartBadge();
	renderDrawer();
};
window.rmCart = (id) => {
	cart = cart.filter((x) => x.id !== id);
	updateCartBadge();
	renderDrawer();
};

const drawerBg = document.getElementById("drawerBg");
const cartDrawer = document.getElementById("cartDrawer");
const drawerClose = document.getElementById("drawerClose");
function openDrawer() {
	cartDrawer.classList.add("open");
	drawerBg.classList.add("open");
	document.body.style.overflow = "hidden";
}
function closeDrawer() {
	cartDrawer.classList.remove("open");
	drawerBg.classList.remove("open");
	document.body.style.overflow = "";
}
document.getElementById("cartToggleBtn").addEventListener("click", openDrawer);
drawerClose.addEventListener("click", closeDrawer);
drawerBg.addEventListener("click", closeDrawer);

const checkoutOverlay = document.getElementById("checkoutOverlay");
document.getElementById("checkoutOpenBtn").addEventListener("click", () => {
	if (!cart.length) {
		showToast("⚠ Your cart is empty.");
		return;
	}
	closeDrawer();
	const items = document.getElementById("coItems");
	const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
	items.innerHTML = cart
		.map(
			(i) =>
				`<div class="co-item"><span>${i.name} × ${i.qty}</span><span>₱${(i.price * i.qty).toLocaleString()}</span></div>`,
		)
		.join("");
	document.getElementById("coTotal").textContent = "₱" + total.toLocaleString();
	checkoutOverlay.classList.add("open");
	document.body.style.overflow = "hidden";
});
function closeCheckout() {
	checkoutOverlay.classList.remove("open");
	document.body.style.overflow = "";
}
document
	.getElementById("checkoutClose")
	.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", (e) => {
	if (e.target === checkoutOverlay) closeCheckout();
});
document.getElementById("placeOrderBtn").addEventListener("click", () => {
	const firstName = document.getElementById("coFirstName");
	const lastName = document.getElementById("coLastName");
	const address = document.getElementById("coAddress");
	const phone = document.getElementById("coPhone");

	[firstName, lastName, address, phone].forEach((field) => {
		if (field) {
			field.classList.remove("error");
			const parent = field.closest(".form-group");
			if (parent) {
				const existingError = parent.querySelector(".error-message");
				if (existingError) existingError.remove();
			}
		}
	});

	let isValid = true;
	let errorMessage = "";

	if (!firstName || !firstName.value.trim()) {
		isValid = false;
		errorMessage = "Please enter your first name";
		if (firstName) {
			firstName.classList.add("error");
			const parent = firstName.closest(".form-group");
			if (parent && !parent.querySelector(".error-message")) {
				const errorSpan = document.createElement("span");
				errorSpan.className = "error-message";
				errorSpan.textContent = "First name is required";
				parent.appendChild(errorSpan);
			}
		}
	} else if (!lastName || !lastName.value.trim()) {
		isValid = false;
		errorMessage = "Please enter your last name";
		if (lastName) {
			lastName.classList.add("error");
			const parent = lastName.closest(".form-group");
			if (parent && !parent.querySelector(".error-message")) {
				const errorSpan = document.createElement("span");
				errorSpan.className = "error-message";
				errorSpan.textContent = "Last name is required";
				parent.appendChild(errorSpan);
			}
		}
	} else if (!address || !address.value.trim()) {
		isValid = false;
		errorMessage = "Please enter your shipping address";
		if (address) {
			address.classList.add("error");
			const parent = address.closest(".form-group");
			if (parent && !parent.querySelector(".error-message")) {
				const errorSpan = document.createElement("span");
				errorSpan.className = "error-message";
				errorSpan.textContent = "Address is required";
				parent.appendChild(errorSpan);
			}
		}
	} else if (!phone || !phone.value.trim()) {
		isValid = false;
		errorMessage = "Please enter your phone number";
		if (phone) {
			phone.classList.add("error");
			const parent = phone.closest(".form-group");
			if (parent && !parent.querySelector(".error-message")) {
				const errorSpan = document.createElement("span");
				errorSpan.className = "error-message";
				errorSpan.textContent = "Phone number is required";
				parent.appendChild(errorSpan);
			}
		}
	} else if (phone.value.trim().length < 10) {
		isValid = false;
		errorMessage = "Please enter a valid phone number";
		if (phone) {
			phone.classList.add("error");
			const parent = phone.closest(".form-group");
			if (parent && !parent.querySelector(".error-message")) {
				const errorSpan = document.createElement("span");
				errorSpan.className = "error-message";
				errorSpan.textContent = "Phone number must be at least 10 digits";
				parent.appendChild(errorSpan);
			}
		}
	}

	if (!isValid) {
		showToast(`⚠ ${errorMessage}`);
		return;
	}

	const orderNumber =
		"LB-" +
		new Date().getFullYear() +
		String(Math.floor(Math.random() * 10000)).padStart(4, "0");
	const today = new Date();
	const formattedDate = today.toLocaleDateString("en-PH", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const etaDate = new Date();
	etaDate.setDate(etaDate.getDate() + 5);
	const formattedEta = etaDate.toLocaleDateString("en-PH", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const selectedPay = document.querySelector(
		"#checkoutOverlay input[name='pay']:checked",
	);
	const paymentMethod = selectedPay
		? selectedPay.parentElement.textContent.trim()
		: "Cash on Delivery";

	const orderItems = cart
		.map((item) => `${item.name} × ${item.qty}`)
		.join(", ");
	const orderTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

	if (currentUser) {
		currentUser.orders.unshift({
			id: orderNumber,
			date: formattedDate,
			product: cart.length === 1 ? cart[0].name : `${cart.length} items`,
			total: `₱${orderTotal.toLocaleString()}`,
			status: "Processing",
		});
	}

	ORDERS_DATA.unshift({
		id: orderNumber,
		status: "Processing",
		eta: formattedEta,
		step: 2,
	});

	const customerName = `${firstName.value.trim()} ${lastName.value.trim()}`;

	closeCheckout();

	cart = [];
	updateCartBadge();
	renderDrawer();

	const successDiv = document.createElement("div");
	successDiv.className = "order-success-message";
	successDiv.innerHTML = `
		<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
		<h3>Order Placed Successfully!</h3>
		<p>Thank you, ${customerName}!</p>
		<div class="order-id">${orderNumber}</div>
		<p style="font-size: 0.75rem; color: var(--tw-3);">
			📦 Est. Delivery: ${formattedEta}<br>
			💳 ${paymentMethod}
		</p>
		<button class="btn-navy" id="trackOrderBtn" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Track Order →</button>
	`;
	document.body.appendChild(successDiv);

	const trackBtn = document.getElementById("trackOrderBtn");
	if (trackBtn) {
		trackBtn.addEventListener("click", () => {
			successDiv.remove();
			navigate("track");
			setTimeout(() => {
				document.getElementById("trackInput").value = orderNumber;
				trackOrder();
			}, 350);
		});
	}

	setTimeout(() => {
		if (successDiv && successDiv.parentNode) {
			successDiv.style.opacity = "0";
			setTimeout(() => successDiv.remove(), 300);
		}
	}, 8000);

	showToast(`🎉 Order ${orderNumber} placed! You can track it in My Orders.`);
});

document.querySelectorAll(".pay-opt").forEach((opt) => {
	opt.addEventListener("click", () => {
		document
			.querySelectorAll(".pay-opt")
			.forEach((o) => o.classList.remove("active"));
		opt.classList.add("active");
	});
});

window.setTrack = (val) => {
	document.getElementById("trackInput").value = val;
	trackOrder();
};
document.getElementById("trackBtn").addEventListener("click", trackOrder);
document.getElementById("trackInput").addEventListener("keydown", (e) => {
	if (e.key === "Enter") trackOrder();
});

function trackOrder() {
	const val = document.getElementById("trackInput").value.trim().toUpperCase();
	const order = ORDERS_DATA.find((o) => o.id === val);
	if (!order) {
		showToast("⚠ Order not found. Try LB-20240001");
		return;
	}

	document.getElementById("trNum").textContent = val;
	document.getElementById("trEta").textContent = order.eta;
	document.getElementById("trStatus").textContent = order.status;

	for (let i = 1; i <= 4; i++) {
		document
			.getElementById("tst" + i)
			?.classList.toggle("done", i <= order.step);
	}
	const fills = { 1: "0%", 2: "33%", 3: "66%", 4: "100%" };
	const fill = document.getElementById("tpFill");
	if (fill) {
		fill.style.width = "0%";
		setTimeout(() => (fill.style.width = fills[order.step] || "0%"), 100);
	}
	const res = document.getElementById("trackResult");
	res.classList.add("show");
}

function renderOrders() {
	const tbody = document.getElementById("ordersBody");
	if (!tbody) return;
	const orders = currentUser?.orders || [];
	tbody.innerHTML = orders.length
		? orders
				.map(
					(o) => `<tr>
        <td>${o.id}</td>
        <td>${o.date}</td>
        <td>${o.product}</td>
        <td>${o.total}</td>
        <td><span class="pill ${o.status === "Delivered" ? "green" : o.status === "Shipped" ? "blue" : "yellow"}">${o.status}</span></td>
        <td><span class="ts-link" onclick="document.getElementById('trackInput').value='${o.id}';navigate('track');trackOrder()"style="cursor:pointer;color:var(--navy-light);font-size:.8rem">Track →</span></td>
      </tr>`,
				)
				.join("")
		: '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:2rem">No orders yet.</td></tr>';
}

document.getElementById("contactSubmitBtn")?.addEventListener("click", () => {
	const fields = ["cfFname", "cfLname", "cfEmail", "cfMsg"];
	if (fields.some((f) => !document.getElementById(f)?.value.trim())) {
		showToast("⚠ Please fill in all fields.");
		return;
	}
	const s = document.getElementById("contactSuccess");
	if (s) {
		s.style.display = "block";
		setTimeout(() => (s.style.display = "none"), 5000);
	}
	fields.forEach((f) => {
		const el = document.getElementById(f);
		if (el) el.value = "";
	});
	showToast("✅ Message sent! We'll reply within 24 hours.");
});

function renderSalesChart() {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const values = [
		42000, 55000, 48000, 62000, 58000, 71000, 68000, 75000, 69000, 80000, 75520,
		89300,
	];
	const maxVal = Math.max(...values);
	const barsEl = document.getElementById("scBars");
	const labsEl = document.getElementById("scLabels");
	if (!barsEl) return;
	barsEl.innerHTML = values
		.map(
			(v, i) => `
    <div class="sc-bar${i === 11 ? " highlight" : ""}" style="height:${Math.round((v / maxVal) * 100)}%;background:${i === 11 ? "var(--navy)" : "var(--navy-dim)"}">
      <div class="sc-bar-tip">₱${(v / 1000).toFixed(0)}K</div>
    </div>`,
		)
		.join("");
	labsEl.innerHTML = months.map((m) => `<span>${m}</span>`).join("");
}

function setAdminDate() {
	const el = document.getElementById("adminDate");
	if (el)
		el.textContent = new Date().toLocaleDateString("en-PH", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
}

function showToast(msg) {
	const wrap = document.getElementById("toastWrap");
	const t = document.createElement("div");
	t.className = "toast";
	t.textContent = msg;
	wrap.appendChild(t);
	setTimeout(() => {
		t.classList.add("out");
		setTimeout(() => t.remove(), 300);
	}, 3200);
}

document.addEventListener("DOMContentLoaded", () => {
	renderFeatured();
	renderProducts("all");
	renderInventory("inventoryBody");
	renderInventory("adminInventoryBody");
	renderReviews();
	renderSalesChart();
	setAdminDate();
	observeReveals();
});
