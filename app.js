// Liste d'exemples d'annonces initiales
let products = JSON.parse(localStorage.getItem('marchelibre_products')) || [
    {
        id: 1,
        title: "Ciment gris haute résistance (Lot de gros)",
        category: "materiel",
        price: "8.5$ / Sac",
        moq: "Commande min: 100 Sacs",
        desc: "Ciment recommandé pour grands travaux, dalles et ouvrages d'art.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500",
        contact: "+243000000000"
    },
    {
        id: 2,
        title: "Parcelle clôturée à vendre (Katwa / Butembo)",
        category: "immobilier",
        price: "15,000$ (Négociable)",
        moq: "Dimensions: 20m / 20m",
        desc: "Excellente parcelle commerciale et résidentielle avec titres fonciers en ordre.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
        contact: "+243000000000"
    }
];

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const catBtns = document.querySelectorAll('.cat-btn');

const modal = document.getElementById('addProductModal');
const openModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.querySelector('.close-btn');
const productForm = document.getElementById('productForm');

// Fonction d'affichage des annonces
function displayProducts(productsToDisplay) {
    productsGrid.innerHTML = '';
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777; padding: 40px 0;">Aucune offre disponible pour le moment sur MARCHÉ LIBRE.</p>';
        return;
    }

    productsToDisplay.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const imgSrc = prod.image && prod.image.startsWith('http') ? prod.image : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';

        card.innerHTML = `
            <div>
                <img src="${imgSrc}" alt="${prod.title}" class="product-img">
                <div class="product-info">
                    <h3 class="product-title">${prod.title}</h3>
                    <div class="product-price">${prod.price}</div>
                    <div class="product-moq"><i class="fa-solid fa-box"></i> ${prod.moq}</div>
                    <p class="product-desc">${prod.desc}</p>
                </div>
            </div>
            <a href="https://wa.me/${prod.contact}?text=Bonjour,%20je%20vous%20contacte%20depuis%20MARCHÉ%20LIBRE%20concernant%20l'offre:%20*${encodeURIComponent(prod.title)}*" target="_blank" class="btn-whatsapp">
                <i class="fa-brands fa-whatsapp"></i> Contacter / Négocier
            </a>
        `;
        productsGrid.appendChild(card);
    });
}

// Filtrage par catégorie
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
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
    const filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query));
    displayProducts(filtered);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', handleSearch);

// Gestion de la modale
openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// Formulaire de publication
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProd = {
        id: Date.now(),
        title: document.getElementById('prodTitle').value,
        category: document.getElementById('prodCategory').value,
        price: document.getElementById('prodPrice').value,
        moq: document.getElementById('prodMoq').value,
        desc: document.getElementById('prodDesc').value,
        image: document.getElementById('prodImage').value,
        contact: document.getElementById('prodContact').value.replace(/[^0-9+]/g, '')
    };

    products.unshift(newProd);
    localStorage.setItem('marchelibre_products', JSON.stringify(products));
    
    productForm.reset();
    modal.style.display = 'none';
    displayProducts(products);
});

// Initialisation au chargement
displayProducts(products);
