import React, { useState, useCallback } from 'react'
import { Route } from 'react-router-dom'
import RepositoryOverview from '../pages/RepositoryOverview'
import RepositoryDetail from '../pages/RepositoryDetail'
import { APIResult, useAPI } from '../hooks/RegistryAPI'
import Repository from '../data/Repository'

/**
 * A wrapper around components that need to poll the Docker registry HTTP API.
 * @param props
 */
export default function RepositoryDataView() {

    const [ repositories, setRepositories ] = useState<Repository[]>([])

    // TODO: Move useCallback() into the useAPI() hook so that the arrow function can be inlined
    const processRepositoryData = useCallback(async (fetchAPI: (endpoint: string) => Promise<APIResult>) => {

        const res = await fetchAPI('_catalog')
        if (!res.success) return
        const repositoryNames = res.data as { repositories: string[] }

        const repositoriesWithTags = await Promise.all(repositoryNames.repositories.map(async (name) => {
            const res = await fetchAPI(`${name}/tags/list`)
            if (!res.success) return { name, tags: [] }
            const repository = res.data as { name: string, tags: string[] }
            return { name, tags: repository.tags.reverse() }
        }))

        const repositoriesWithTagsAndModificationDate = await Promise.all(repositoriesWithTags.map(async (repo) => {
            const defaultValue = (repo: any) => {
                return { architecture: '', modified: '', ...repo }
            }
            if (repo.tags.length < 1) return defaultValue(repo)
            const res = await fetchAPI(`${repo.name}/manifests/${repo.tags[0]}`)
            if (!res.success) return defaultValue(repo)
            const repository = res.data as { architecture: string, history: { v1Compatibility: string }[] }
            if (repository.history.length < 1) return defaultValue(repo)
            const v1Compat = JSON.parse(repository.history[0].v1Compatibility) as { created: string }
            return { ...repo, modified: v1Compat.created, architecture: repository.architecture }
        }))

        setRepositories(repositoriesWithTagsAndModificationDate)
    }, [])

    const { isLoading } = useAPI(processRepositoryData)

    return (
        <>
            <Route path="/" exact>
                <RepositoryOverview repositories={repositories} isLoading={isLoading} />
            </Route>
            {repositories.map(repo => (
                <Route path={'/' + repo.name} exact>
                    <RepositoryDetail repository={repo} />
                </Route>
            ))}
        </>
    )
}
