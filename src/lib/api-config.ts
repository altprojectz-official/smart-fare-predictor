/**
 * API Configuration for Smart Fare Predictor
 */

// In production, we use the Render URL. In development, we use relative /api
// which is proxied by Vite to http://localhost:8000
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction
    ? "https://smart-fare-predictor-1.onrender.com"
    : ""; // Empty string means use relative path (proxied in dev)

export const getApiUrl = (endpoint: string) => {
    // Ensure endpoint starts with /
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
};
