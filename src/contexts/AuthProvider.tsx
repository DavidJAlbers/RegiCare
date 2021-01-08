/**
 * Provides the React context for making authentication data available across components without passing props down the hierarchy.
 */

import React, { ReactNode, useContext, useState } from 'react'

const AuthContext = React.createContext<AuthProviderValue>({
    user: null,
    authString: null,
    login: (_user: string, _password: string) => Promise.resolve({
        success: false,
        error: 'auth_service_unavailable'
    }),
    logout: () => {},
})

/**
 * Returns the value of the current authentication context, specified through the nearest AuthProvider.
 * 
 * @see AuthProvider
 */
export const useAuth = () => useContext(AuthContext)

export type LoginResult = {
    success: true
} | {
    success: false
    error: 'registry_unreachable' | 'invalid_auth_credentials' | 'unknown_error' | 'auth_service_unavailable'
}

interface AuthProviderProps {
    children: ReactNode,
    registry: string
}

interface AuthProviderValue {
    user: string | null,
    authString: string | null,
    login: (user: string, password: string) => Promise<LoginResult>,
    logout: () => void
}

/**
 * A context provider that injects authentication utilities as value.
 * The values of "user" (the user currently logged in) and "authString" (a Base64 encoded string with the user's name and password) can then be read via useAuth().
 * 
 * @param props 
 * @see useAuth()
 */
export default function AuthProvider({ children, registry }: AuthProviderProps) {
    const [ user, setUser ] = useState<string|null>(null)
    const [ authString, setAuthString ] = useState<string|null>(null)

    const login = async (user: string, password: string): Promise<LoginResult> => {
        try {
            const potentialAuthString = `Basic ${btoa(`${user}:${password}`)}`
            const res = await fetch(`https://${registry}/v2/`,{
                headers: {
                    'Accept': 'application/json',
                    'Authorization': potentialAuthString
                }
            })

            switch (res.status) {
                case 200: setUser(user); setAuthString(potentialAuthString); return { success: true }
                case 401:                                                    return { success: false, error: 'invalid_auth_credentials' }
                default:                                                     return { success: false, error: 'unknown_error' }
            }
        } catch {
            return { success: false, error: 'registry_unreachable' }
        }
    }

    const logout = () => { setUser(null); setAuthString(null) }

    return (
        <AuthContext.Provider value={{user, authString, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
