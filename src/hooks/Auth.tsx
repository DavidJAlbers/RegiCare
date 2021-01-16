/**
 * Provides the React hook for making authentication data available across components.
 */

import React, { useCallback, useState, useContext, ReactNode } from 'react'
import useRegistryInfo from './RegistryInfo'

interface AuthContextValue {
    user?: string,
    authString?: string,
    login: (user: string, password: string) => Promise<LoginResult>,
    logout: () => void
}

const initialContextValue: AuthContextValue = {
    user: undefined, 
    authString: undefined, 
    login: (user: string, password: string) => {
        return Promise.resolve({ success: false, error: 'auth_service_unavailable' })
    }, 
    logout: () => {}
}

const AuthContext = React.createContext<AuthContextValue>(initialContextValue)

/**
 * Possible results for calling the login function on the useAuth() hook.
 * 
 * @see useAuth
 */
export type LoginResult = {
    success: true
} | {
    success: false
    error: 'registry_unreachable' | 'invalid_auth_credentials' | 'unknown_error' | 'auth_service_unavailable'
}

/**
 * A hook that encapsulates authentication functionality. 
 * 
 * The currently logged in user can be read through the `user` field.
 * As the Docker registry supports only HTTP Basic Auth out of the box, we also provide an `authString` field which contains 
 * the following Base64-encoded string: "Basic [user]:[password]"
 * Both of these fields may be null if no user is currently logged in.
 * 
 * Login and logout attempts can be made through the `login(user, password)` and `logout()` functions.
 * 
 * A call to `logout()` will always succeed. Any logged in user will be immediately logged out and subsequent reads of `user` or `authString` will return `null`.
 * If no user is currently logged in, `logout()` will do nothing.
 * 
 * The `login()` function is slightly more complex. It issues an API call to the registry's endpoint to verify the userdata's correctness.
 * Depending on the response of the API, different types of `LoginResult`s are returned.
 * 
 * This hook must only be used within an <AuthProvider />, as it is backed by a React context!
 */
export default function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {

    const { registryDomain: registry } = useRegistryInfo()

    const [ user, setUser ] = useState<string|undefined>(undefined)
    const [ authString, setAuthString ] = useState<string|undefined>(undefined)

    const login = useCallback(async (user: string, password: string): Promise<LoginResult> => {
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
    }, [registry])

    const logout = useCallback(() => {
        setUser(undefined)
        setAuthString(undefined)
    }, [])

    return (
        <AuthContext.Provider value={{user, authString, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
