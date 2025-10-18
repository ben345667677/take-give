// API Base URL
// Use relative URL to work with nginx proxy
const API_URL = '/api';

// Global state
let categories = [];
let allProducts = [];
let currentView = 'home';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    loadCategories();
    loadProducts();

    // Setup form listeners
    setupFormListeners();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = '/loginPage/index.html';
        return;
    }
}

// Load user information
function loadUserInfo() {
    try {
        const userString = localStorage.getItem('user');

        if (userString) {
            const user = JSON.parse(userString);
            const userNameElement = document.getElementById('userName');

            if (userNameElement && user && user.name) {
                userNameElement.textContent = user.name;
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
        localStorage.removeItem('user');
    }
}

// Logout function
function logout() {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }

    window.location.href = '/loginPage/index.html';
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();

        if (result.success) {
            categories = result.data;
            displayCategories(categories);
            populateCategoryFilters(categories);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display categories grid
function displayCategories(cats) {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    grid.innerHTML = cats.map(cat => `
        <div class="category-card" onclick="filterByCategory(${cat.id})">
            <div class="category-icon">
                <i class="${cat.icon}"></i>
            </div>
            <h3 class="category-name">${cat.name_he}</h3>
            <p class="category-count">${cat.subcategories ? cat.subcategories.length : 0} תתי קטגוריות</p>
        </div>
    `).join('');
}

// Populate category filters
function populateCategoryFilters(cats) {
    const filterSelect = document.getElementById('categoryFilter');
    const categorySelect = document.getElementById('categorySelect');

    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">כל הקטגוריות</option>' +
            cats.map(cat => `<option value="${cat.id}">${cat.name_he}</option>`).join('');
    }

    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">בחר קטגוריה</option>' +
            cats.map(cat => `<option value="${cat.id}">${cat.name_he}</option>`).join('');
    }
}

// Load subcategories when category is selected
function loadSubcategories() {
    const categoryId = document.getElementById('categorySelect').value;
    const subcategoryGroup = document.getElementById('subcategoryGroup');
    const subcategorySelect = document.getElementById('subcategorySelect');

    if (!categoryId) {
        subcategoryGroup.style.display = 'none';
        return;
    }

    const category = categories.find(c => c.id == categoryId);

    if (category && category.subcategories && category.subcategories.length > 0) {
        subcategorySelect.innerHTML = '<option value="">בחר תת קטגוריה</option>' +
            category.subcategories.map(sub =>
                `<option value="${sub.id}">${sub.name_he}</option>`
            ).join('');
        subcategoryGroup.style.display = 'block';
    } else {
        subcategoryGroup.style.display = 'none';
    }
}

// Load products
async function loadProducts(filters = {}) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';

    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/products?${params}`);
        const result = await response.json();

        if (result.success) {
            allProducts = result.data;
            displayProducts(allProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}

// Display products grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-results">לא נמצאו מודעות</p>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const conditionText = getConditionText(product.condition_state);
        const timeAgo = getTimeAgo(product.created_at);

        return `
            <div class="product-card">
                <div class="product-image">
                    ${product.primary_image ?
                        `<img src="${product.primary_image}" alt="${product.title}">` :
                        '<div class="no-image"><i class="fas fa-image"></i></div>'
                    }
                    ${product.is_trade_allowed ? '<span class="badge badge-trade">החלפה אפשרית</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${truncateText(product.description, 100)}</p>
                    <div class="product-meta">
                        <span class="product-price">${product.price ? `₪${Number(product.price).toLocaleString()}` : 'ללא מחיר'}</span>
                        <span class="product-condition">${conditionText}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-location"><i class="fas fa-map-marker-alt"></i> ${product.location_city || 'לא צוין'}</span>
                        <span class="product-time">${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter by category
function filterByCategory(categoryId) {
    document.getElementById('categoryFilter').value = categoryId;
    filterProducts();

    // Scroll to products section
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

// Filter products
function filterProducts() {
    const categoryId = document.getElementById('categoryFilter').value;
    const filters = {};

    if (categoryId) {
        filters.category_id = categoryId;
    }

    loadProducts(filters);
}

// Search products
let searchTimeout;
function searchProducts() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const search = document.getElementById('searchInput').value;
        const filters = {};

        if (search) {
            filters.search = search;
        }

        const categoryId = document.getElementById('categoryFilter').value;
        if (categoryId) {
            filters.category_id = categoryId;
        }

        loadProducts(filters);
    }, 500);
}

// Show different views
function showView(view) {
    currentView = view;

    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    switch(view) {
        case 'home':
            document.getElementById('categoriesSection').style.display = 'block';
            document.getElementById('productsSection').style.display = 'block';
            document.querySelectorAll('.nav-link')[0].classList.add('active');
            break;
        case 'my-products':
            document.getElementById('myProductsSection').style.display = 'block';
            document.querySelectorAll('.nav-link')[1].classList.add('active');
            loadMyProducts();
            break;
        case 'post-product':
            document.getElementById('postProductSection').style.display = 'block';
            document.querySelectorAll('.nav-link')[2].classList.add('active');
            break;
    }
}

// Setup form listeners
function setupFormListeners() {
    const form = document.getElementById('postProductForm');
    if (form) {
        form.addEventListener('submit', handlePostProduct);
    }
}

// Toggle trade description
function toggleTradeDesc() {
    const checkbox = document.getElementById('isTradeAllowed');
    const tradeGroup = document.getElementById('tradeDescGroup');

    tradeGroup.style.display = checkbox.checked ? 'block' : 'none';
}

// Handle post product form
async function handlePostProduct(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('נדרש להתחבר מחדש');
        window.location.href = '/loginPage/index.html';
        return;
    }

    const productData = {
        category_id: document.getElementById('categorySelect').value,
        subcategory_id: document.getElementById('subcategorySelect').value || null,
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value || null,
        currency: 'ILS',
        condition_state: document.getElementById('productCondition').value,
        location_city: document.getElementById('productCity').value,
        location_area: document.getElementById('productArea').value,
        contact_name: document.getElementById('contactName').value,
        contact_phone: document.getElementById('contactPhone').value,
        contact_email: document.getElementById('contactEmail').value,
        is_negotiable: document.getElementById('isNegotiable').checked,
        is_trade_allowed: document.getElementById('isTradeAllowed').checked,
        trade_description: document.getElementById('tradeDescription').value || null,
        images: []
    };

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (result.success) {
            alert('המודעה פורסמה בהצלחה!');
            document.getElementById('postProductForm').reset();
            showView('home');
            loadProducts();
        } else {
            alert('שגיאה בפרסום המודעה: ' + result.message);
        }
    } catch (error) {
        console.error('Error posting product:', error);
        alert('שגיאה בפרסום המודעה');
    }
}

// Load user's products
async function loadMyProducts() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/products/user/my-products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            displayMyProducts(result.data);
        }
    } catch (error) {
        console.error('Error loading my products:', error);
    }
}

// Display user's products
function displayMyProducts(products) {
    const grid = document.getElementById('myProductsGrid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<p class="no-results">עדיין לא פרסמת מודעות</p>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const statusText = getStatusText(product.status);
        const conditionText = getConditionText(product.condition_state);

        return `
            <div class="product-card my-product">
                <div class="product-image">
                    ${product.primary_image ?
                        `<img src="${product.primary_image}" alt="${product.title}">` :
                        '<div class="no-image"><i class="fas fa-image"></i></div>'
                    }
                    <span class="badge badge-status">${statusText}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${truncateText(product.description, 100)}</p>
                    <div class="product-meta">
                        <span class="product-price">${product.price ? `₪${Number(product.price).toLocaleString()}` : 'ללא מחיר'}</span>
                        <span class="product-condition">${conditionText}</span>
                    </div>
                    <div class="product-stats">
                        <span><i class="fas fa-eye"></i> ${product.views_count} צפיות</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Utility functions
function getConditionText(condition) {
    const conditions = {
        'new': 'חדש',
        'like_new': 'כמו חדש',
        'good': 'טוב',
        'fair': 'סביר',
        'for_parts': 'לחלקים'
    };
    return conditions[condition] || condition;
}

function getStatusText(status) {
    const statuses = {
        'active': 'פעיל',
        'sold': 'נמכר',
        'inactive': 'לא פעיל',
        'pending': 'ממתין'
    };
    return statuses[status] || status;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        'שנה': 31536000,
        'חודש': 2592000,
        'שבוע': 604800,
        'יום': 86400,
        'שעה': 3600,
        'דקה': 60
    };

    for (const [name, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value);
        if (interval >= 1) {
            return `לפני ${interval} ${name}${interval > 1 ? (name === 'שנה' ? 'ים' : name === 'חודש' ? 'ים' : name === 'שבוע' ? 'ות' : name === 'יום' ? 'ים' : name === 'שעה' ? 'ות' : 'ות') : ''}`;
        }
    }

    return 'הרגע';
}
