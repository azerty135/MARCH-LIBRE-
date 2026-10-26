// Base de données par défaut (Exemples variés : Gros, Détail, Maisons, Parcelles)
const DEFAULT_ITEMS = [
    {
        id: "1",
        title: "Parcelle Titrée 20m x 25m avec Titre Foncier",
        category: "immobilier",
        location: "Kinshasa, Ngaliema",
        price: 45000,
        commission: 5, // 5%
        type: "commission",
        whatsapp: "243810000000",
        description: "Terrain bien situé, avec certificat d'enregistrement. Route accessible.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: "2",
        title: "Villa Moderne 4 Chambres + Piscine",
        category: "immobilier",
        location: "Lubumbashi, Golf",
        price: 180000,
        commission: 7, // 7%
        type: "commission",
        whatsapp: "243810000000",
        description: "Villa haute sécurité, grand jardin, forage d'eau, groupe électrogène.",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: "3",
        title: "Sacs de Ciment Gris 50kg (Wholesale)",
        category: "gros",
        location: "Matadi / Kinshasa",
        retailPrice: 11,
        wholesalePrice: 9.2,
        minWholesale: 100,
        type: "commerce",
        whatsapp: "243810000000",
        description: "Ciment standard 42.5. Livraison disponible par camion complet.",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: "4",
        title: "Cartons d'Huile Végétale 5L x 4",
        category: "gros",
        location: "Goma",
        retailPrice: 28,
        wholesalePrice: 24,
        minWholesale: 20,
        type: "commerce",
        whatsapp: "243810000000",
        description: "Huile de table raffinée pure sans cholestérol. Tarif préférentiel pour demi-grossistes.",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: "5",
        title: "Toyota Hilux D-4D Année 2018",
        category: "vehicules",
        location: "Kolwezi",
        price: 24000,
        commission: 4, // 4%
        type: "commission",
        whatsapp: "243810000000",
        description: "Moteur impeccable, 4x4, boîte manuelle, climatisation d'origine.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=60"
    }
];

// Initialisation du stockage
let items = JSON.parse(localStorage.getItem('gm_items')) || DEFAULT_ITEMS;
let currentFilter = 'all';

function saveItems() {
    localStorage.setItem('gm_items', JSON.stringify(items));
}

// Rendu des annonces
function renderGrid() {
    const grid = document.getElementById('productGrid');
    const search = document.getElementById('searchInput').value.toLowerCase();
    grid.innerHTML = '';

    const filtered = items.filter(item => {
        const matchesFilter = (currentFilter === 'all') || (item.category === currentFilter);
        const matchesSearch = item.title.toLowerCase().includes(search) || 
                              item.location.toLowerCase().includes(search) ||
                              item.description.toLowerCase().includes(search);
        return matchesFilter && matchesSearch;
    });

    document.getElementById('itemCount').innerText = `${filtered.length} offre(s) trouvée(s)`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <p class="text-base">Aucune annonce trouvée pour cette catégorie ou recherche.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition";

        // Traitement pour Vente Marchandise vs Immobilier / Commission
        let pricingHTML = '';
        let messageWhatsApp = '';

        if (item.type === 'commission') {
            const commissionAmount = (item.price * (item.commission / 100)).toFixed(2);
            pricingHTML = `
                <div class="bg-amber-50 p-2.5 rounded-lg mb-3 border border-amber-200">
                    <div class="text-lg font-bold text-gray-900">$${item.price.toLocaleString()}</div>
                    <div class="text-xs text-amber-800 font-medium flex justify-between mt-0.5">
                        <span>Commission (${item.commission}%) :</span>
                        <span class="font-bold">$${commissionAmount}</span>
                    </div>
                </div>
            `;
            messageWhatsApp = encodeURIComponent(`Bonjour, je vous contacte au sujet de votre annonce : "${item.title}" au prix de $${item.price} (Localisation : ${item.location}). Est-elle toujours disponible ?`);
        } else {
            pricingHTML = `
                <div class="bg-blue-50 p-2.5 rounded-lg mb-3 border border-blue-200 space-y-1">
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-gray-500">Détail :</span>
                        <span class="font-bold text-gray-900 text-sm">$${item.retailPrice} / unité</span>
                    </div>
                    <div class="flex justify-between items-center text-xs border-t pt-1 border-blue-100">
                        <span class="text-indigo-700 font-semibold">Gros (min. ${item.minWholesale}) :</span>
                        <span class="font-extrabold text-indigo-700 text-sm">$${item.wholesalePrice} / unité</span>
                    </div>
                </div>
            `;
            messageWhatsApp = encodeURIComponent(`Bonjour, je suis intéressé par votre produit : "${item.title}". Je souhaite avoir des informations sur les disponibilités pour l'achat en gros ou détail.`);
        }

        const tagColor = item.category === 'immobilier' ? 'bg-amber-100 text-amber-800' :
                         item.category === 'gros' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800';

        card.innerHTML = `
            <div class="h-44 w-full overflow-hidden bg-gray-200 relative">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                <span class="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagColor}">
                    ${item.category}
                </span>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center text-xs text-gray-500 mb-1 gap-1">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                        <span>${item.location}</span>
                    </div>
                    <h2 class="font-bold text-gray-900 text-sm mb-2 line-clamp-2">${item.title}</h2>
                    <p class="text-xs text-gray-600 mb-3 line-clamp-2">${item.description}</p>
                    ${pricingHTML}
                </div>
                <div class="pt-2 border-t mt-auto">
                    <a href="https://wa.me/${item.whatsapp}?text=${messageWhatsApp}" target="_blank" 
                       class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition">
                        <i data-lucide="phone" class="w-3.5 h-3.5"></i> Contacter / Négocier
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    lucide.createIcons();
}

// Filtre par catégorie
function setFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-white', 'text-gray-800');
    });
    event.currentTarget.classList.add('bg-indigo-600', 'text-white');
    event.currentTarget.classList.remove('bg-white', 'text-gray-800');
    renderGrid();
}

// Gestion du formulaire
function toggleFormFields() {
    const cat = document.getElementById('category').value;
    const realEstateFields = document.getElementById('realEstateFields');
    const merchandiseFields = document.getElementById('merchandiseFields');

    if (cat === 'immobilier' || cat === 'vehicules') {
        realEstateFields.classList.remove('hidden');
        merchandiseFields.classList.add('hidden');
    } else {
        realEstateFields.classList.add('hidden');
        merchandiseFields.classList.remove('hidden');
    }
}

function openModal() {
    document.getElementById('listingModal').classList.remove('hidden');
    toggleFormFields();
}

function closeModal() {
    document.getElementById('listingModal').classList.add('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const category = document.getElementById('category').value;
    const isCommissionType = (category === 'immobilier' || category === 'vehicules');

    const defaultImg = isCommissionType 
        ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=60"
        : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60";

    const newItem = {
        id: Date.now().toString(),
        title: document.getElementById('title').value,
        category: category,
        location: document.getElementById('location').value,
        whatsapp: document.getElementById('whatsapp').value.replace(/\+/g, '').trim(),
        description: document.getElementById('description').value,
        image: document.getElementById('imageUrl').value || defaultImg,
        type: isCommissionType ? 'commission' : 'commerce'
    };

    if (isCommissionType) {
        newItem.price = parseFloat(document.getElementById('propertyPrice').value) || 0;
        newItem.commission = parseFloat(document.getElementById('commissionRate').value) || 0;
    } else {
        newItem.retailPrice = parseFloat(document.getElementById('retailPrice').value) || 0;
        newItem.wholesalePrice = parseFloat(document.getElementById('wholesalePrice').value) || 0;
        newItem.minWholesale = parseInt(document.getElementById('minWholesale').value) || 1;
    }

    items.unshift(newItem);
    saveItems();
    renderGrid();
    closeModal();
    document.getElementById('addListingForm').reset();
}

// Écouteur pour la recherche
document.getElementById('searchInput').addEventListener('input', renderGrid);

// Exécution au chargement
window.addEventListener('DOMContentLoaded', () => {
    toggleFormFields();
    renderGrid();
});
