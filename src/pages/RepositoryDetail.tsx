import React from 'react'
import CopyableCommand from '../components/CopyableCommand'
import Header from '../components/Header'
import Repository from '../data/Repository'
import useRegistry from '../hooks/Registry'

interface RepositoryProps {
    repository: Repository
}

/**
 * Returns the view for a single repository, with the option to quickly pull the repository's first tag.
 * @param props
 */
export default function RepositoryDetail({ repository }: RepositoryProps) {
    const { registry } = useRegistry()
    return (
        <div className="container">
            <Header subtitle="Repository" title={repository.name} />
            <p>Pull the <code>{repository.tags[0]}</code> tag using <CopyableCommand command={'docker pull ' + registry + '/' + repository.name + ':' + repository.tags[0]} />.</p>
        </div>
    )
}
