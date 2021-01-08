import React from 'react'

interface HeaderProps {
    title: string,
    subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <div>
            <h3 className="fw-bold text-uppercase">{subtitle}</h3>
            <h1 className="display-1 mb-4">{title}</h1>
        </div>
    )
}
