import React from 'react'
import CopyableCommand from './CopyableCommand'
import Header from './Header'
import Repository from '../data/Repository'

interface RepositoryProps {
    registry: string,
    repository: Repository
}

/**
 * Returns the view for a single repository, with the option to quickly pull the repository's first tag.
 * @param props
 */
export default function RepositoryDetail({ registry, repository }: RepositoryProps) {
    return (
        <div className="container">
            <Header subtitle="Repository" title={repository.name} />
            <p>Pull the <code>{repository.tags[0]}</code> tag using <CopyableCommand command={'docker pull ' + registry + '/' + repository.name + ':' + repository.tags[0]} />.</p>
        </div>
    )
}
