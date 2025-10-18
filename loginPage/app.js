// API Configuration
// Use relative URL to work with nginx proxy
const API_BASE_URL = '/api';

// API Endpoints
const API_ENDPOINTS = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`
};

// Utility Functions
function showMessage(elementId, message, isError = false) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) return;

    // Prevent XSS by using textContent
    messageElement.textContent = message;
    messageElement.className = `message ${isError ? 'error' : 'success'}`;
    messageElement.style.display = 'block';

    // הסתר הודעה אחרי 5 שניות
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearForm(formId) {
    document.getElementById(formId).reset();
}

// API Functions
async function loginUser(email, password) {
    try {
        const response = await fetch(API_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch(API_ENDPOINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return {
            success: true,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Form Handlers
document.addEventListener('DOMContentLoaded', function() {

    // Sign In Form Handler
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('signInEmail').value.trim();
            const password = document.getElementById('signInPassword').value;

            // Validation
            if (!email || !password) {
                showMessage('signInMessage', 'Please fill in all fields', true);
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('signInMessage', 'Please enter a valid email address', true);
                return;
            }

            // Show loading
            const submitButton = signInForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing in...</span>';
            submitButton.disabled = true;

            // Make API call
            const result = await loginUser(email, password);

            // Reset button
            submitButton.innerHTML = originalButtonHTML;
            submitButton.disabled = false;

            if (result.success) {
                showMessage('signInMessage', 'Login successful! Redirecting...', false);

                try {
                    // שמור את ה-token אם יש
                    if (result.data.token) {
                        localStorage.setItem('authToken', result.data.token);
                    }

                    // שמור מידע על המשתמש
                    if (result.data.user) {
                        localStorage.setItem('user', JSON.stringify(result.data.user));
                    }
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    showMessage('signInMessage', 'Login successful but could not save session', true);
                }

                // נקה את הטופס
                clearForm('signInForm');

                // הפנה לדף הבא (שנה לפי הצורך)
                setTimeout(() => {
                    window.location.href = '/menuPage/index.html';
                }, 1500);
            } else {
                showMessage('signInMessage', result.error, true);
            }
        });
    }

    // Sign Up Form Handler
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('signUpName').value.trim();
            const email = document.getElementById('signUpEmail').value.trim();
            const password = document.getElementById('signUpPassword').value;

            // Validation
            if (!name || !email || !password) {
                showMessage('signUpMessage', 'Please fill in all fields', true);
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('signUpMessage', 'Please enter a valid email address', true);
                return;
            }

            if (password.length < 6) {
                showMessage('signUpMessage', 'Password must be at least 6 characters', true);
                return;
            }

            // Show loading
            const submitButton = signUpForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Creating account...</span>';
            submitButton.disabled = true;

            // Make API call
            const result = await registerUser(name, email, password);

            // Reset button
            submitButton.innerHTML = originalButtonHTML;
            submitButton.disabled = false;

            if (result.success) {
                showMessage('signUpMessage', 'Registration successful! Please sign in.', false);

                // נקה את הטופס
                clearForm('signUpForm');

                // עבור לטופס התחברות
                setTimeout(() => {
                    document.getElementById('signIn').click();
                }, 2000);
            } else {
                // בדוק אם האימייל כבר קיים
                if (result.error.toLowerCase().includes('already') ||
                    result.error.toLowerCase().includes('exist') ||
                    result.error.toLowerCase().includes('registered')) {

                    // הצג הודעה יפה
                    showMessage('signUpMessage', '✓ This email is already registered. Redirecting to login...', false);

                    // עבור לטופס התחברות ומלא את האימייל
                    setTimeout(() => {
                        document.getElementById('signIn').click();

                        // מלא את האימייל בטופס התחברות
                        setTimeout(() => {
                            document.getElementById('signInEmail').value = email;
                            document.getElementById('signInEmail').focus();

                            // הצג הודעה בטופס התחברות
                            showMessage('signInMessage', 'Welcome back! Please enter your password.', false);
                        }, 700);
                    }, 1500);
                } else {
                    showMessage('signUpMessage', result.error, true);
                }
            }
        });
    }
});

// Helper function to get stored token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Helper function to get stored user
function getUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
}

// Helper function to logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/loginPage/index.html';
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loginUser,
        registerUser,
        getAuthToken,
        getUser,
        logout
    };
}
