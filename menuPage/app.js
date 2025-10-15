// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // No token, redirect to login
        window.location.href = '/loginPage/index.html';
        return;
    }

    // Optional: Validate token with backend
    // You can add API call here to verify token is still valid
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
        // Clear corrupted data
        localStorage.removeItem('user');
    }
}

// Logout function
function logout() {
    try {
        // Clear all auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }

    // Redirect to login page
    window.location.href = '/loginPage/index.html';
}

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to get user
function getUser() {
    try {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}
