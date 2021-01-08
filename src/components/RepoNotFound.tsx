import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from './Header'

interface RepoNotFoundProps {
    registry: string
}

/**
 * Renders the page that indicates that a given repository could not be found in the registry.
 * @param props
 */
export default function RepoNotFound({ registry }: RepoNotFoundProps) {
    const repo = useLocation().pathname.substring(1)
    return (
        <div className="container">
            <Header title="Repository unavailable" subtitle="404 Not Found" />
            <p>
                The repository <em>{repo}</em> was not found on <em>{registry}</em>.
            </p>
            <p>
                Please verify the spelling of <em>{repo}</em>.
                Otherwise, use the overview page to search for the repository or contact the registry's administrator.
            </p>
            <Link to="/">
                <p className="btn btn-primary">Go to overview page</p>
            </Link>
        </div>
    )
}
