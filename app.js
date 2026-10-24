// Mot de passe administrateur (Vous pouvez le modifier ici facilement)
const ADMIN_PASSWORD = "marchelibre2026"; 

// Liste initiale des annonces
let products = JSON.parse(localStorage.getItem('marchelibre_products')) || [
    {
        id: 1,
        title: "Maïs en sacs de 25 kg (Qualité supérieure)",
        category: "agriculture",
        price: "FC 85 000",
        moq: "Dès 10 sacs",
        location: "Lubumbashi, Marché Kenya",
        desc: "Disponible en grande quantité pour grossistes et détaillants.",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d207b?w=500",
        contact: "+243000000000",
        isGros: true
    },
    {
        id: 2,
        title: "Ciment Portland - Vente en gros",
        category: "materiel",
        price: "$14.5",
        moq: "Dès 50 sacs",
        location: "Lubumbashi, Centre-ville",
        desc: "Idéal pour tous vos chantiers de construction et d'infrastructures.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
        contact: "+243000000000",
        isGros: true
    },
    {
        id: 3,
        title: "Parcelle clôturée de 20 x 25 m",
        category: "immobilier",
        price: "$25 000",
        moq: "Dispo immédiate",
        location: "Lubumbashi, Golf",
        desc: "Emplacement stratégique avec documents complets en ordre.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
        contact: "+243000000000",
        isGros: false
    },
    {
        id: 4,
        title: "Outils de chantier - Lot professionnel",
        category: "materiel",
        price: "$450",
        moq: "Lot complet",
        location: "Lubumbashi, Bel-Air",
        desc: "Matériel de pointe pour entreprises de construction et ingénierie.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500",
        contact: "+243000000000",
        isGros: true
    }
];

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const countBadge = document.getElementById('countBadge');

// Modales
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

// Affichage dynamique des produits
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    countBadge.textContent = `${productsToDisplay.length} annonce${productsToDisplay.length > 1 ? 's' : ''}`;

    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding: 40px 0;">Aucune offre trouvée sur MARCHÉ LIBRE.</p>';
        return;
    }

    productsToDisplay.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imgSrc = prod.image && prod.image.startsWith('http') ? prod.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';

        card.innerHTML = `
            <div class="card-top-image">
                <span class="badge-cat">${prod.category}</span>
                ${prod.isGros ? '<span class="badge-gros">GROS</span>' : ''}
                <img src="${imgSrc}" alt="${prod.title}">
            </div>
            <div class="card-body">
                <h3 class="card-title">${prod.title}</h3>
                <div class="card-location"><i class="fa-solid fa-location-dot"></i> ${prod.location || 'Local'}</div>
                <div class="card-price-row">
                    <span class="card-price">${prod.price}</span>
                    <span class="card-moq">${prod.moq || ''}</span>
                </div>
            </div>
            <a href="https://wa.me/${prod.contact}?text=Bonjour,%20je%20vous%20contacte%20depuis%20MARCHÉ%20LIBRE%20pour%20l'offre:%20*${encodeURIComponent(prod.title)}*" target="_blank" class="btn-card-whatsapp">
                <i class="fa-brands fa-whatsapp"></i> Négocier / WhatsApp
            </a>
        `;
        productsGrid.appendChild(card);
    });
}

// Filtrage par onglets
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        
        if (cat === 'all') {
            displayProducts(products);
        } else {
            const filtered = products.filter(p => p.category === cat);
            displayProducts(filtered);
        }
    });
});

// Recherche
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.location.toLowerCase().includes(query));
    displayProducts(filtered);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', handleSearch);

// Gestion des modales
openAddModalBtn.addEventListener('click', () => addModal.style.display = 'flex');

function closeModals() {
    addModal.style.display = 'none';
    adminModal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    if (e.target === addModal || e.target === adminModal) closeModals();
});

// Publication d'une annonce
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
        contact: document.getElementById('prodContact').value.replace(/[^0-9+]/g, ''),
        isGros: document.getElementById('prodCategory').value === 'gros' || document.getElementById('prodCategory').value === 'materiel'
    };

    products.unshift(newProd);
    localStorage.setItem('marchelibre_products', JSON.stringify(products));
    
    productForm.reset();
    closeModals();
    displayProducts(products);
});

// --- LOGIQUE DU PANNEAU ADMINISTRATEUR ---
adminLoginBtn.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    // Vérifier si déjà connecté dans la session active
    if (sessionStorage.getItem('marchelibre_admin_auth') === 'true') {
        showAdminPanel();
    } else {
        adminAuthSection.style.display = 'block';
        adminPanelSection.style.display = 'none';
        adminPasswordInput.value = '';
    }
});

adminLoginSubmit.addEventListener('click', () => {
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('marchelibre_admin_auth', 'true');
        showAdminPanel();
    } else {
        alert("Mot de passe administrateur incorrect.");
    }
});

function showAdminPanel() {
    adminAuthSection.style.display = 'none';
    adminPanelSection.style.display = 'block';
    renderAdminProducts();
}

adminLogoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('marchelibre_admin_auth');
    adminAuthSection.style.display = 'block';
    adminPanelSection.style.display = 'none';
});

function renderAdminProducts() {
    adminTotalCount.textContent = products.length;
    adminProductList.innerHTML = '';

    if (products.length === 0) {
        adminProductList.innerHTML = '<p style="text-align:center; color:#64748b; font-size:12px;">Aucune annonce en mémoire.</p>';
        return;
    }

    products.forEach((prod) => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.innerHTML = `
            <div style="flex: 1; padding-right: 10px;">
                <strong>${prod.title}</strong><br>
                <span style="color: #64748b; font-size: 11px;">${prod.price} - ${prod.location || 'Lieu non spécifié'}</span>
            </div>
            <button class="btn-delete-item" onclick="deleteProduct(${prod.id})"><i class="fa-solid fa-trash"></i> Supprimer</button>
        `;
        adminProductList.appendChild(row);
    });
}

// Fonction de suppression globale contrôlée par l'admin
window.deleteProduct = function(id) {
    if (confirm("Voulez-vous vraiment supprimer définitivement cette annonce ?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('marchelibre_products', JSON.stringify(products));
        displayProducts(products);
        renderAdminProducts();
    }
};

// Initialisation au chargement de la page
displayProducts(products);
