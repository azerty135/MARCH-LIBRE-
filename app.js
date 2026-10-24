// Données initiales par défaut
const defaultListings = [
    {
        id: 1,
        title: "Parcelle 20m x 20m à Vendre",
        type: "immobilier",
        price: "15000",
        commission: "5% pour l'intermédiaire",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
        description: "Terrain bien situé avec titre de propriété valide. Idéal pour construction immédiate.",
        phone: "+243000000000"
    },
    {
        id: 2,
        title: "Sac de Ciment 50kg - Vente en Gros",
        type: "gros",
        price: "12",
        commission: "0.5$ / sac pour commissionnaire",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
        description: "Commande minimale: 100 sacs. Livraison possible.",
        phone: "+243000000000"
    },
    {
        id: 3,
        title: "Maison Résidentielle 4 Chambres",
        type: "immobilier",
        price: "45000",
        commission: "1000$ commission fixe",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400",
        description: "Maison clôturée avec électricité et eau constante.",
        phone: "+243000000000"
    }
];

// Chargement des données depuis localStorage ou défaut
let listings = JSON.parse(localStorage.getItem('app_listings')) || defaultListings;

function saveListings() {
    localStorage.setItem('app_listings', JSON.stringify(listings));
}

function renderListings(itemsToRender) {
    const grid = document.getElementById('grid-listings');
    grid.innerHTML = '';

    if (itemsToRender.length === 0) {
        grid.innerHTML = '<p>Aucune annonce disponible.</p>';
        return;
    }

    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const badgeClass = `badge-${item.type}`;
        const typeLabel = {
            'gros': 'Vente en Gros',
            'detail': 'Vente au Détail',
            'immobilier': 'Immobilier / Courtage',
            'equipement': 'Matériel / Article'
        }[item.type] || 'Général';

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="card-body">
                <span class="badge ${badgeClass}">${typeLabel}</span>
                <h3>${item.title}</h3>
                <p class="price">$${item.price}</p>
                <p class="commission"><strong>Commission :</strong> ${item.commission || 'Non spécifiée'}</p>
                <p>${item.description}</p>
                <a class="btn-contact" href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Bonjour,%20je%20suis%20intéressé%20par%20votre%20annonce:%20${encodeURIComponent(item.title)}" target="_blank">Contacter sur WhatsApp</a>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterCategory(category) {
    if (category === 'all') {
        renderListings(listings);
    } else {
        const filtered = listings.filter(item => item.type === category);
        renderListings(filtered);
    }
}

function searchItems() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filtered = listings.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
    );
    renderListings(filtered);
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

// Soumission du formulaire d'ajout
document.getElementById('add-item-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newItem = {
        id: Date.now(),
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        price: document.getElementById('price').value,
        commission: document.getElementById('commission').value,
        image: document.getElementById('image').value || 'https://via.placeholder.com/300',
        description: document.getElementById('description').value,
        phone: document.getElementById('phone').value
    };

    listings.unshift(newItem);
    saveListings();
    renderListings(listings);
    
    this.reset();
    toggleModal('publish-modal');
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    renderListings(listings);
});
