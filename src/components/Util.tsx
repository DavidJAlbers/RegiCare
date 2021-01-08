/**
 * Provides generic utility used across RegiCare.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { OptionalAnchor } from '../generic/Util'

/**
 * Returns the string "contact the registry's administrator".
 * If the "admin" prop is set, the word "contact" is an anchor with this prop's value as href.
 * 
 * Control capitalisation using the "uppercase" prop.
 * 
 * @param props
 */
export const ContactAdmin = ({ uppercase = false, admin = '' }) => {
    const contact = uppercase ? 'Contact' : 'contact'
    return (
        <>
            <OptionalAnchor text={contact} href={admin} /> the registry's administrator
        </>
    )
}

/**
 * Returns a paragraph referring to the administrator's contact for support.
 * @param props
 */
export const Help = ({ admin = '' }) => (<p>To get help, <ContactAdmin admin={admin}/>. <Link to="/">Go back to the index page.</Link></p>)