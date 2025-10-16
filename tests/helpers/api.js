const axios = require('axios');

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://backend:3000/api';

/**
 * API Helper class for making HTTP requests
 */
class ApiHelper {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = null;
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
    }

    /**
     * Get headers with optional authorization
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    /**
     * Make GET request
     */
    async get(endpoint, params = {}) {
        try {
            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                headers: this.getHeaders(),
                params
            });
            return response;
        } catch (error) {
            return error.response || error;
        }
    }

    /**
     * Make POST request
     */
    async post(endpoint, data = {}) {
        try {
            const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            return error.response || error;
        }
    }

    /**
     * Make PUT request
     */
    async put(endpoint, data = {}) {
        try {
            const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            return error.response || error;
        }
    }

    /**
     * Make DELETE request
     */
    async delete(endpoint) {
        try {
            const response = await axios.delete(`${this.baseURL}${endpoint}`, {
                headers: this.getHeaders()
            });
            return response;
        } catch (error) {
            return error.response || error;
        }
    }

    /**
     * Wait for API to be ready
     */
    async waitForApi(maxAttempts = 30, delayMs = 2000) {
        console.log('⏳ Waiting for API to be ready...');

        for (let i = 0; i < maxAttempts; i++) {
            try {
                const response = await axios.get(`${this.baseURL}/health`, {
                    timeout: 5000
                });

                if (response.status === 200) {
                    console.log('✅ API is ready!');
                    return true;
                }
            } catch (error) {
                console.log(`Attempt ${i + 1}/${maxAttempts} - API not ready yet...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        throw new Error('API failed to start within timeout period');
    }
}

/**
 * Generate random email for testing
 */
function generateRandomEmail() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `test_${timestamp}_${random}@test.com`;
}

/**
 * Generate random user data
 */
function generateUserData() {
    return {
        name: `Test User ${Date.now()}`,
        email: generateRandomEmail(),
        password: 'Test123456'
    };
}

/**
 * Sleep/delay helper
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    ApiHelper,
    generateRandomEmail,
    generateUserData,
    sleep
};
