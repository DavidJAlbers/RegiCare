import { useEffect, useState } from "react";
import useAuth from "./Auth";
import useRegistryInfo from "./RegistryInfo";

export type APIResult = {
    success: true,
    data: any
} | {
    success: false,
    error: 'unauthorised' | 'unknown_error'
}

async function fetchAPI(registryDomain: string, authString: string|undefined, endpoint: string): Promise<APIResult> {
    if (!authString) {
        return { success: false, error: 'unauthorised' }
    } else {
        try {
            const res = await fetch(`https://${registryDomain}/v2/${endpoint}`, { headers: { 'Authorization': authString, 'Accept': 'application/json' }})
            const data = await res.json()
            return { success: true, data }
        } catch {
            return { success: false, error: 'unknown_error' }
        }
    }
}

export function useAPI(executor: (fetchAPI: (endpoint: string) => Promise<APIResult>) => void) {

    const { authString } = useAuth()
    const { registryDomain } = useRegistryInfo()

    // Indicate that the API request is currently out there.
    // Components may use this in order to display a loading screen instead of an empty data table.
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const doIt = async () => {
            setIsLoading(true)
            await executor(async (endpoint: string) => await fetchAPI(registryDomain, authString, endpoint))
            setIsLoading(false)
        }
        doIt()
    }, [authString, registryDomain, executor])

    return { isLoading }
}