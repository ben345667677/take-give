// This script will handle authentication-related functionality for the menu page.

document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('authLink');
    const profileLink = document.getElementById('profileLink');

    // Function to check authentication status (placeholder)
    function checkAuthStatus() {
        // In a real application, this would check a token or session from localStorage or a cookie
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Function to update the UI based on authentication status
    function updateAuthUI() {
        if (checkAuthStatus()) {
            authLink.textContent = 'התנתק'; // Logout
            authLink.href = '#'; // Handle logout via JS
            profileLink.style.display = 'block'; // Show profile link
        } else {
            authLink.textContent = 'התחבר'; // Login
            authLink.href = '/loginPage/index.html'; // Link to login page
            profileLink.style.display = 'none'; // Hide profile link
        }
    }

    // Event listener for the authentication link
    authLink.addEventListener('click', (event) => {
        if (checkAuthStatus()) {
            // If logged in, perform logout
            event.preventDefault(); // Prevent default link behavior
            localStorage.removeItem('isLoggedIn'); // Clear login status
            localStorage.removeItem('authToken'); // Clear auth token
            localStorage.removeItem('user'); // Clear user data
            updateAuthUI(); // Update UI
            alert('התנתקת בהצלחה!'); // Notify user
            window.location.href = '../loginPage/index.html'; // Redirect to login page
        }
        // If not logged in, the href will handle the navigation to the login page
    });

    // Initial UI update when the page loads
    updateAuthUI();
});
