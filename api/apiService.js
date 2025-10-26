/**
 * API Service - שירות מרכזי לכל קריאות ה-API
 *
 * קובץ זה מכיל את כל הפונקציות לתקשורת עם הבקאנד
 * כל הפונקציות מחזירות Promise עם המבנה:
 * { success: true/false, data: {...} או error: "..." }
 */

// ===================================================
// הגדרות בסיסיות
// ===================================================

const API_BASE_URL = '/api';

// ===================================================
// פונקציות עזר (Helper Functions)
// ===================================================

/**
 * מחזיר את ה-JWT token מה-localStorage
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * מחזיר את פרטי המשתמש מה-localStorage
 */
function getStoredUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
}

/**
 * שומר את ה-token וה-user ב-localStorage
 */
function saveAuthData(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * מוחק את נתוני ההתחברות מה-localStorage
 */
function clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

/**
 * בודק אם המשתמש מחובר
 */
function isLoggedIn() {
    return getAuthToken() !== null;
}

/**
 * פונקציה מרכזית לביצוע קריאות API
 * @param {string} endpoint - נקודת הקצה (למשל: '/auth/login')
 * @param {object} options - אופציות ל-fetch (method, body, וכו')
 * @param {boolean} requiresAuth - האם צריך JWT token
 */
async function apiCall(endpoint, options = {}, requiresAuth = false) {
    try {
        // הכנת headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // הוספת Authorization header אם נדרש
        if (requiresAuth) {
            const token = getAuthToken();
            if (!token) {
                return {
                    success: false,
                    error: 'Not authenticated. Please log in.'
                };
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        // ביצוע הבקשה
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // קריאת התשובה
        const data = await response.json();

        // בדיקה אם הבקשה הצליחה
        if (!response.ok) {
            return {
                success: false,
                error: data.message || `HTTP Error ${response.status}`,
                statusCode: response.status
            };
        }

        return {
            success: true,
            data: data
        };

    } catch (error) {
        return {
            success: false,
            error: error.message || 'Network error. Please check your connection.'
        };
    }
}

// ===================================================
// Authentication API
// ===================================================

/**
 * הרשמה למערכת
 * @param {string} name - שם מלא
 * @param {string} email - כתובת אימייל
 * @param {string} password - סיסמה (מינימום 6 תווים)
 */
async function register(name, email, password) {
    return await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
    });
}

/**
 * התחברות למערכת
 * @param {string} email - כתובת אימייל
 * @param {string} password - סיסמה
 */
async function login(email, password) {
    const result = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    // אם ההתחברות הצליחה, שמור את הנתונים
    if (result.success && result.data.token) {
        saveAuthData(result.data.token, result.data.user);
    }

    return result;
}

/**
 * התנתקות מהמערכת
 */
function logout() {
    clearAuthData();
    window.location.href = '/loginPage/index.html';
}

/**
 * בדיקת תקינות token
 */
async function verifyToken() {
    return await apiCall('/auth/verify', {
        method: 'GET'
    }, true);
}

// ===================================================
// Users API
// ===================================================

/**
 * קבלת פרטי המשתמש המחובר
 */
async function getCurrentUser() {
    return await apiCall('/users/me', {
        method: 'GET'
    }, true);
}

/**
 * עדכון פרטי המשתמש המחובר
 * @param {object} userData - אובייקט עם השדות לעדכון (name, last_name, phone)
 * דוגמה: { name: "ישראל", last_name: "כהן", phone: "050-1234567" }
 */
async function updateCurrentUser(userData) {
    return await apiCall('/users/me', {
        method: 'PUT',
        body: JSON.stringify(userData)
    }, true);
}

/**
 * שינוי סיסמה
 * @param {string} currentPassword - סיסמה נוכחית
 * @param {string} newPassword - סיסמה חדשה
 */
async function changePassword(currentPassword, newPassword) {
    return await apiCall('/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
    }, true);
}

/**
 * מחיקת חשבון המשתמש
 */
async function deleteAccount() {
    const result = await apiCall('/users/me', {
        method: 'DELETE'
    }, true);

    // אם המחיקה הצליחה, התנתק
    if (result.success) {
        clearAuthData();
    }

    return result;
}

/**
 * קבלת כל המוצרים של המשתמש המחובר
 */
async function getMyProducts() {
    return await apiCall('/users/me/products', {
        method: 'GET'
    }, true);
}

// ===================================================
// Categories API
// ===================================================

/**
 * קבלת כל הקטגוריות
 */
async function getAllCategories() {
    return await apiCall('/categories', {
        method: 'GET'
    });
}

/**
 * קבלת קטגוריה ספציפית
 * @param {number} categoryId - מזהה הקטגוריה
 */
async function getCategoryById(categoryId) {
    return await apiCall(`/categories/${categoryId}`, {
        method: 'GET'
    });
}

/**
 * יצירת קטגוריה חדשה (Admin בלבד)
 * @param {string} name - שם הקטגוריה
 * @param {string} description - תיאור (אופציונלי)
 * @param {string} icon - Font Awesome class (אופציונלי)
 */
async function createCategory(name, description = null, icon = null) {
    const categoryData = { name };
    if (description) categoryData.description = description;
    if (icon) categoryData.icon = icon;

    return await apiCall('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    }, true);
}

// ===================================================
// Products API
// ===================================================

/**
 * קבלת כל המוצרים (עם אפשרות לסינון)
 * @param {object} filters - אובייקט עם פילטרים (אופציונלי)
 * דוגמה: { category: 1, search: "laptop", limit: 20, offset: 0, sort: "newest" }
 */
async function getAllProducts(filters = {}) {
    // יצירת query string מהפילטרים
    const queryParams = new URLSearchParams();

    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);
    if (filters.sort) queryParams.append('sort', filters.sort);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';

    return await apiCall(endpoint, {
        method: 'GET'
    });
}

/**
 * קבלת מוצר ספציפי
 * @param {number} productId - מזהה המוצר
 */
async function getProductById(productId) {
    return await apiCall(`/products/${productId}`, {
        method: 'GET'
    });
}

/**
 * יצירת מוצר חדש
 * @param {object} productData - נתוני המוצר
 * דוגמה: {
 *   name: "Laptop Dell",
 *   description: "מחשב נייד במצב מצוין",
 *   category_id: 1,
 *   location: "תל אביב"
 * }
 */
async function createProduct(productData) {
    // ולידציה בסיסית
    if (!productData.name || !productData.description || !productData.category_id || !productData.location) {
        return {
            success: false,
            error: 'Missing required fields: name, description, category_id, location'
        };
    }

    return await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }, true);
}

/**
 * עדכון מוצר קיים
 * @param {number} productId - מזהה המוצר
 * @param {object} productData - נתוני המוצר לעדכון
 * דוגמה: { name: "שם חדש", status: "reserved" }
 */
async function updateProduct(productId, productData) {
    return await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }, true);
}

/**
 * מחיקת מוצר
 * @param {number} productId - מזהה המוצר
 */
async function deleteProduct(productId) {
    return await apiCall(`/products/${productId}`, {
        method: 'DELETE'
    }, true);
}

/**
 * עדכון סטטוס מוצר
 * @param {number} productId - מזהה המוצר
 * @param {string} status - הסטטוס החדש (available/reserved/given)
 */
async function updateProductStatus(productId, status) {
    return await updateProduct(productId, { status });
}

/**
 * סימון מוצר כ"נמסר" ותיעוד העסקה בדאטה בייס
 * @param {number} productId - מזהה המוצר
 * @param {object} transactionData - נתוני העסקה
 * דוגמה: {
 *   recipient_name: "יוסי כהן",
 *   recipient_phone: "050-1234567",
 *   recipient_email: "yossi@example.com",
 *   recipient_id: 5, // אופציונלי - אם המקבל רשום במערכת
 *   notes: "נמסר בשעה 14:00"
 * }
 */
async function markProductAsGiven(productId, transactionData) {
    // ולידציה בסיסית
    if (!transactionData.recipient_name && !transactionData.recipient_id) {
        return {
            success: false,
            error: 'Must provide either recipient_name or recipient_id'
        };
    }

    return await apiCall(`/products/${productId}/mark-given`, {
        method: 'POST',
        body: JSON.stringify(transactionData)
    }, true);
}

// ===================================================
// ייצוא הפונקציות (ES6 Modules)
// ===================================================

export {
    // Helper functions
    getAuthToken,
    getStoredUser,
    isLoggedIn,

    // Authentication
    register,
    login,
    logout,
    verifyToken,

    // Users
    getCurrentUser,
    updateCurrentUser,
    changePassword,
    deleteAccount,
    getMyProducts,

    // Categories
    getAllCategories,
    getCategoryById,
    createCategory,

    // Products
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    markProductAsGiven
};

// ===================================================
// ייצוא לשימוש ללא ES6 Modules (CommonJS / Global)
// ===================================================

if (typeof window !== 'undefined') {
    // הפיכת כל הפונקציות לגלובליות
    window.API = {
        // Helper functions
        getAuthToken,
        getStoredUser,
        isLoggedIn,

        // Authentication
        register,
        login,
        logout,
        verifyToken,

        // Users
        getCurrentUser,
        updateCurrentUser,
        changePassword,
        deleteAccount,
        getMyProducts,

        // Categories
        getAllCategories,
        getCategoryById,
        createCategory,

        // Products
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStatus,
        markProductAsGiven
    };
}
