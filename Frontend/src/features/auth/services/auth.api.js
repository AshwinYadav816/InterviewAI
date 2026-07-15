import axios from "axios";

// In production set VITE_API_URL (in Vercel) to your deployed backend URL,
// e.g. https://interviewai-backend.onrender.com — falls back to localhost in dev.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true,
});

export async function register({username, email, password}) {
    try {
        const response = await api.post("/register", {username, email, password});
        return response;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export async function login({email, password}) {
    try {
        const response = await api.post("/login", {email, password});
        return response;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.get("/logout");
        return response;
    } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/get-me");
        return response;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}
