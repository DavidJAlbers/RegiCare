import React from 'react'
import { useProduct } from './ProductProvider'
import { OptionalAnchor, Greeter, Clock } from './Util'

/**
 * A generic site footer that only uses the values from the product context (and hence, from "product.json").
 * 
 * @see ProductProvider
 * @see useProduct()
 */
export default function Footer() {
    const { title, version, author, country, support } = useProduct()
    return (
        <div>
            <hr className="mt-5"/>
            <div className="container text-center">
                <p><strong>{title} {version}</strong></p>
                <p>
                &copy; {new Date().getFullYear()} by <OptionalAnchor text={author} href={support} /><br/>
                <Greeter from={country}/> It's <Clock/>.
                </p>
            </div>
        </div>
    )
}