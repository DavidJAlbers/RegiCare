import React from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useProduct } from '../hooks/Product'
import Header from '../components/Header'
import Repository from '../data/Repository'
import useRegistryInfo from '../hooks/RegistryInfo'

interface TagListProps {
    tags: Array<string>
}

/**
 * Renders a list of image tags formatted as code, separated by commas.
 * 
 * If the tag list is longer than two tags, the rendered list is shortened to two tags, with the number of total tags printed at the end.
 * 
 * @param props
 */
// TODO Special case for exactly 2 tags
function TagList({ tags }: TagListProps) {
    if (tags.length === 0) {
        return (
            <>none available</>
        )
    }
    else if (tags.length === 1) {
        return (
            <>
                <code>{tags[0]}</code>
            </>
        )
    } else if (tags.length === 2) {
        return (
            <>
                <code>{tags[0]}</code>, <code>{tags[1]}</code>
            </>
        )
    } else {
        return (
            <>
                {tags.slice(0, 2).map((tag) => (
                    <span key={tag}><code>{tag}</code>, </span>
                ))}
                ... (total {tags.length})
            </>
        )
    }
}

interface RepositoryOverviewProps { 
    repositories: Array<Repository>,
    isLoading: boolean 
}

/**
 * Renders the overview page for viewing all repositories in the registry.
 * @param props
 */
// TODO Support pagination
export default function RepositoryOverview({ repositories, isLoading }: RepositoryOverviewProps) {
    const { registryDomain: registry } = useRegistryInfo()
    const { title: product } = useProduct()
    const history = useHistory()

    return (
        <Container>
            <Header subtitle={product} title="Repository Overview" />
            <p>The following repositories are hosted on <em>{registry}</em>:</p>
            {isLoading ?
                <Container className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </Container>
            :
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Architecture</th>
                            <th>Last update</th>
                            <th>Available tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repositories.map(repo => (
                            // The History API is needed in order to make React Router work together with clickable <tr>s, as usual <Link>s do not work here.
                            <tr key={repo.name} style={{cursor: "pointer"}} onClick={() => history.push(repo.name)}>
                                <td>{repo.name}</td>
                                <td>{repo.architecture}</td>
                                <td>{new Date(Date.parse(repo.modified)).toLocaleString()}</td>
                                <td><TagList tags={repo.tags} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </Container>
    )
}
