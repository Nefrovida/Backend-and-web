import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const location = useLocation()
    const navigate = useNavigate()

    const [isLoadingAuth, setIsLoadingAuth] = useState(false)
    const [user, setUser] = useState(null)

    const verifySession = useCallback(() => {
        const result = fetch("/api/auth/validate-session", {
            method: "GET",
            credentials: "include"
        })

        if (!result.success) {
            console.log("Session was not there and/or valid, logging out..")
        }


    }, [])

    const logout = () => {
        
    }

    useEffect(() => {
        const isValidSession = verifySession()
    })
}