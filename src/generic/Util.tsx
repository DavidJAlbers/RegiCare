/**
 * Provides generic but widely-used components for various purposes.
 */

import { useState, useEffect } from 'react'

/**
 * An optional anchor that will only render out as an HTML anchor tag if the "href" prop is set.
 * The anchor tag will have the "text" prop as inner HTML.
 * 
 * If no "href" is set, the "text" will be rendered plainly.
 * 
 * @param props
 */
export const OptionalAnchor = ({text, href}: OptionalAnchorProps) => (
    <>{href ? <a href={href}>{text}</a> : <>{text}</>}</>
)

interface OptionalAnchorProps {
    text: string, 
    href: string
}

/**
 * A component that renders the current local time as standard formatted text.
 * Has a built-in timer that refreshes the time every second.
 */
export const Clock = () => {
    const [ date, setDate ] = useState(new Date())
    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])
    return (
        <>{date.toLocaleTimeString()}</>
    )
}

/**
 * A greeting string that greets the user from a specific place, country etc. (specified via the "from" prop).
 * @param props 
 */
export const Greeter = ({ from }: GreeterProps) => (<span>Hello from {from}.</span>)

interface GreeterProps {
    from: string
}