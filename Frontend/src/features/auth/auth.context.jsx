import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // On every app load, ask the backend "am I already logged in?" using the
    // httpOnly cookie. If the cookie is valid, restore the session so a refresh
    // keeps the user logged in (instead of bouncing them to /login).
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const { data } = await getMe()
                setUser(data.user)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }} >
            {children}
        </AuthContext.Provider>
    )
}
