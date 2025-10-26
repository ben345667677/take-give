// API Configuration
// Use relative URL to work with nginx proxy
const API_BASE_URL = '/api';

// הדפס מידע על המערכת בטעינת הדף
console.log('═══════════════════════════════════════');
console.log('🚀 Take-Give App Loaded');
console.log('📍 API Base URL:', API_BASE_URL);
console.log('🌐 Current URL:', window.location.href);
console.log('═══════════════════════════════════════');

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
            // הדפס שגיאה מפורטת לקונסול
            console.error('Login error:', {
                status: response.status,
                statusText: response.statusText,
                message: data.message,
                email: email
            });

            throw new Error(data.message || 'Login failed');
        }

        // הדפס הצלחה לקונסול
        console.log('✅ Login successful:', { email, user: data.user });

        return {
            success: true,
            data: data
        };
    } catch (error) {
        // הדפס שגיאה כללית לקונסול
        console.error('❌ Login failed:', error);

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
            // הדפס שגיאה מפורטת לקונסול
            console.error('Registration error:', {
                status: response.status,
                statusText: response.statusText,
                message: data.message,
                email: email,
                name: name
            });

            throw new Error(data.message || 'Registration failed');
        }

        // הדפס הצלחה לקונסול
        console.log('✅ Registration successful:', { email, name, user: data.user });

        return {
            success: true,
            data: data
        };
    } catch (error) {
        // הדפס שגיאה כללית לקונסול
        console.error('❌ Registration failed:', error);

        return {
            success: false,
            error: error.message
        };
    }
}

// Form Handlers
document.addEventListener('DOMContentLoaded', function () {

    // Sign In Form Handler
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('signInEmail').value.trim();
            const password = document.getElementById('signInPassword').value;

            // Validation
            if (!email || !password) {
                console.warn('⚠️ Login validation failed: Missing fields');
                showMessage('signInMessage', 'נא למלא את כל השדות', true);
                return;
            }

            if (!isValidEmail(email)) {
                console.warn('⚠️ Login validation failed: Invalid email format');
                showMessage('signInMessage', 'נא להזין כתובת אימייל תקינה', true);
                return;
            }

            console.log('🔄 Attempting login for:', email);

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
                const userName = result.data.user?.name || 'משתמש';
                showMessage('signInMessage', `✓ שלום ${userName}! מתחבר למערכת...`, false);

                try {
                    // שמור את ה-token אם יש
                    if (result.data.token) {
                        localStorage.setItem('authToken', result.data.token);
                        console.log('✅ Auth token saved to localStorage');
                    }

                    // שמור מידע על המשתמש
                    if (result.data.user) {
                        localStorage.setItem('user', JSON.stringify(result.data.user));
                        console.log('✅ User data saved to localStorage');
                    }
                    localStorage.setItem('isLoggedIn', 'true'); // Set login status
                    console.log('✅ Login status set to true in localStorage');
                } catch (error) {
                    console.error('❌ Error saving to localStorage:', error);
                    showMessage('signInMessage', 'התחברות הצליחה אך לא ניתן לשמור את הפרטים', true);
                }

                // נקה את הטופס
                clearForm('signInForm');

                // הפנה לדף הבא (שנה לפי הצורך)
                setTimeout(() => {
                    console.log('🔄 Redirecting to menu page...');
                    window.location.href = '/menuPage/index.html';
                }, 1500);
            } else {
                // תרגום שגיאות נפוצות לעברית
                let userMessage = result.error;

                if (result.error.toLowerCase().includes('invalid credentials') ||
                    result.error.toLowerCase().includes('incorrect password')) {
                    userMessage = 'אימייל או סיסמה שגויים';
                } else if (result.error.toLowerCase().includes('user not found')) {
                    userMessage = 'משתמש לא נמצא במערכת';
                } else if (result.error.toLowerCase().includes('network') ||
                    result.error.toLowerCase().includes('fetch')) {
                    userMessage = 'שגיאת רשת - נא לנסות שוב';
                }

                showMessage('signInMessage', userMessage, true);
            }
        });
    }

    // Sign Up Form Handler
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('signUpName').value.trim();
            const email = document.getElementById('signUpEmail').value.trim();
            const password = document.getElementById('signUpPassword').value;

            // Validation
            if (!name || !email || !password) {
                console.warn('⚠️ Registration validation failed: Missing fields');
                showMessage('signUpMessage', 'נא למלא את כל השדות', true);
                return;
            }

            if (!isValidEmail(email)) {
                console.warn('⚠️ Registration validation failed: Invalid email format');
                showMessage('signUpMessage', 'נא להזין כתובת אימייל תקינה', true);
                return;
            }

            if (password.length < 6) {
                console.warn('⚠️ Registration validation failed: Password too short');
                showMessage('signUpMessage', 'הסיסמה חייבת להכיל לפחות 6 תווים', true);
                return;
            }

            console.log('🔄 Attempting registration for:', email);

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
                showMessage('signUpMessage', '✓ ההרשמה הושלמה בהצלחה! עובר להתחברות...', false);

                // נקה את הטופס
                clearForm('signUpForm');

                // עבור לטופס התחברות
                setTimeout(() => {
                    console.log('🔄 Switching to login form after successful registration');
                    document.getElementById('signIn').click();
                }, 2000);
            } else {
                // תרגום שגיאות נפוצות לעברית
                let userMessage = result.error;

                // בדוק אם האימייל כבר קיים
                if (result.error.toLowerCase().includes('already') ||
                    result.error.toLowerCase().includes('exist') ||
                    result.error.toLowerCase().includes('registered') ||
                    result.error.toLowerCase().includes('duplicate')) {

                    userMessage = 'האימייל כבר רשום במערכת';

                    // הצג הודעה יפה
                    showMessage('signUpMessage', `✓ ${userMessage}. עובר להתחברות...`, false);

                    // עבור לטופס התחברות ומלא את האימייל
                    setTimeout(() => {
                        console.log('🔄 Email exists, switching to login form');
                        document.getElementById('signIn').click();

                        // מלא את האימייל בטופס התחברות
                        setTimeout(() => {
                            document.getElementById('signInEmail').value = email;
                            document.getElementById('signInEmail').focus();

                            // הצג הודעה בטופס התחברות
                            showMessage('signInMessage', 'ברוך שובך! נא להזין את הסיסמה.', false);
                        }, 700);
                    }, 1500);
                } else {
                    // תרגום שגיאות אחרות
                    if (result.error.toLowerCase().includes('network') ||
                        result.error.toLowerCase().includes('fetch')) {
                        userMessage = 'שגיאת רשת - נא לנסות שוב';
                    } else if (result.error.toLowerCase().includes('invalid email')) {
                        userMessage = 'כתובת אימייל לא תקינה';
                    } else if (result.error.toLowerCase().includes('password')) {
                        userMessage = 'שגיאה בסיסמה - נסה סיסמה אחרת';
                    }

                    showMessage('signUpMessage', userMessage, true);
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
    console.log('🚪 User logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('✅ Session cleared');
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
