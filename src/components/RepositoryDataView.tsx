import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import useAuth from '../hooks/Auth'
import RepositoryOverview from '../pages/RepositoryOverview'
import RepositoryDetail from '../pages/RepositoryDetail'
import useRegistry from '../hooks/Registry'

interface CatalogDataResponse {
    repositories: Array<string>,
}

interface TagListDataResponse {
    name: string,
    tags: Array<string>
}

/**
 * A wrapper around components that need to poll the Docker registry HTTP API.
 * @param props
 */
export default function RepositoryDataView() {

    const { registry } = useRegistry()

    const [ repositories, setRepositories ] = useState<Array<{name: string, tags: Array<string>}>>([])

    // Indicate that the API request is currently out there.
    // Components may use this in order to display a loading screen instead of an empty data table.
    const [ isLoading, setIsLoading ] = useState(true)

    const { authString } = useAuth()

    // TODO Urgently needs rework, unify async style and support pagination!
    useEffect(() => {
        if (!authString) return
        setIsLoading(true)
        fetch(`https://${registry}/v2/_catalog`, {
            headers: {
                'Authorization': `${authString}`,
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(async (data: CatalogDataResponse) => {
            const repos = await Promise.all(data.repositories.map(async (repo) => {
                const response: TagListDataResponse = await fetch(`https://${registry}/v2/${repo}/tags/list`, {
                    headers: {
                        'Authorization': `${authString}`,
                        'Accept': 'application/json'
                    }
                }).then(res => res.json())
                return response 
            }))
            setRepositories(repos)
            setIsLoading(false)
        })
        .catch(error => {console.log(error)})
    },[authString, registry])

    return (
        <>
            <Route path="/" exact>
                <RepositoryOverview repositories={repositories.map(repo => {
                    return { ...repo, modified: '2020-12-26 12:34' }
                })} isLoading={isLoading} />
            </Route>
            {repositories.map(repo => (
                <Route path={'/' + repo.name} exact>
                    <RepositoryDetail repository={{ ...repo, modified: '2020-12-27 12:34' }} />
                </Route>
            ))}
        </>
    )
}
