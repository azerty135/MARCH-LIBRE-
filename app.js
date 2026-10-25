const ADMIN_PASSWORD = "marchelibre2026";

let products = JSON.parse(localStorage.getItem('marchelibre_products')) || [
    {
        id: 1,
        title: "Maïs en sacs de 25 kg (Qualité supérieure)",
        category: "agriculture",
        price: "FC 85 000",
        moq: "Dès 10 sacs",
        location: "Lubumbashi",
        desc: "Disponible en grande quantité pour grossistes et détaillants.",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d207b?w=500",
        contact: "+243000000000"
    },
    {
        id: 2,
        title: "Ciment Portland - Vente en gros",
        category: "materiel",
        price: "$14.5",
        moq: "Dès 50 sacs",
        location: "Lubumbashi",
        desc: "Idéal pour tous vos chantiers de construction.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
        contact: "+243000000000"
    },
    {
        id: 3,
        title: "Parcelle clôturée de 20 x 25 m",
        category: "immobilier",
        price: "$25 000",
        moq: "Dispo immédiate",
        location: "Lubumbashi",
        desc: "Emplacement stratégique avec documents complets.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
        contact: "+243000000000"
    }
];

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const catChips = document.querySelectorAll('.cat-chip');
const countBadge = document.getElementById('countBadge');

const addModal = document.getElementById('addProductModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const productForm = document.getElementById('productForm');

const adminModal = document.getElementById('adminModal');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminLoginSubmit = document.getElementById('adminLoginSubmit');
const adminAuthSection = document.getElementById('adminAuthSection');
const adminPanelSection = document.getElementById('adminPanelSection');
const adminTotalCount = document.getElementById('adminTotalCount');
const adminProductList = document.getElementById('adminProductList');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

function displayProducts(list) {
    productsGrid.innerHTML = '';
    countBadge.textContent = `${list.length} annonce${list.length > 1 ? 's' : ''}`;

    if (list.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#6b7280; padding: 40px 0;">Aucune offre trouvée.</p>';
        return;
    }

    list.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imgSrc = prod.image && prod.image.startsWith('http') ? prod.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';

        card.innerHTML = `
            <div class="card-image-container">
                <span class="card-badge">${prod.category}</span>
                <img src="${imgSrc}" alt="${prod.title}">
            </div>
            <div class="card-content">
                <h4 class="card-title">${prod.title}</h4>
                <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${prod.location || 'Local'}</div>
                <div class="card-price-row">
                    <span class="card-price">${prod.price}</span>
                    <span class="card-moq">${prod.moq || ''}</span>
                </div>
            </div>
            <a href="https://wa.me/${prod.contact}?text=Bonjour,%20je%20vous%20contacte%20depuis%20MARCHÉ%20LIBRE%20concernant:%20*${encodeURIComponent(prod.title)}*" target="_blank" class="card-whatsapp-btn">
                <i class="fa-brands fa-whatsapp"></i> Négocier sur WhatsApp
            </a>
        `;
        productsGrid.appendChild(card);
    });
}

// Filtrage par catégories
catChips.forEach(chip => {
    chip.addEventListener('click', () => {
        catChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.getAttribute('data-cat');
        
        if (cat === 'all') {
            displayProducts(products);
        } else {
            displayProducts(products.filter(p => p.category === cat));
        }
    });
});

// Recherche
function handleSearch() {
    const q = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    displayProducts(filtered);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', handleSearch);

// Modales
openAddModalBtn.addEventListener('click', () => addModal.style.display = 'flex');

function closeModals() {
    addModal.style.display = 'none';
    adminModal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    if (e.target === addModal || e.target === adminModal) closeModals();
});

// Formulaire ajout
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        title: document.getElementById('prodTitle').value,
        category: document.getElementById('prodCategory').value,
        price: document.getElementById('prodPrice').value,
        moq: document.getElementById('prodMoq').value,
        location: document.getElementById('prodLocation').value,
        desc: document.getElementById('prodDesc').value,
        image: document.getElementById('prodImage').value,
        contact: document.getElementById('prodContact').value.replace(/[^0-9+]/g, '')
    };

    products.unshift(newProd);
    localStorage.setItem('marchelibre_products', JSON.stringify(products));
    productForm.reset();
    closeModals();
    displayProducts(products);
});

// Admin
adminLoginBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    if (sessionStorage.getItem('ml_admin') === 'true') {
        showAdminPanel();
    } else {
        adminAuthSection.style.display = 'block';
        adminPanelSection.style.display = 'none';
        adminPasswordInput.value = '';
    }
});

adminLoginSubmit.addEventListener('click', () => {
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('ml_admin', 'true');
        showAdminPanel();
    } else {
        alert("Mot de passe incorrect.");
    }
});

function showAdminPanel() {
    adminAuthSection.style.display = 'none';
    adminPanelSection.style.display = 'block';
    renderAdminList();
}

adminLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('ml_admin');
    adminAuthSection.style.display = 'block';
    adminPanelSection.style.display = 'none';
});

function renderAdminList() {
    adminTotalCount.textContent = products.length;
    adminProductList.innerHTML = '';

    if (products.length === 0) {
        adminProductList.innerHTML = '<p style="text-align:center; color:#6b7280; font-size:12px;">Aucune annonce.</p>';
        return;
    }

    products.forEach(p => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.innerHTML = `
            <div>
                <strong>${p.title}</strong><br>
                <span style="color:#6b7280; font-size:11px;">${p.price} - ${p.location}</span>
            </div>
            <button class="btn-delete" onclick="deleteProduct(${p.id})">Supprimer</button>
        `;
        adminProductList.appendChild(row);
    });
}

window.deleteProduct = function(id) {
    if (confirm("Supprimer cette annonce ?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('marchelibre_products', JSON.stringify(products));
        displayProducts(products);
        renderAdminList();
    }
};

displayProducts(products);
