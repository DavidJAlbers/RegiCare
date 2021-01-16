/**
 * Provides the React context for making "product.json"'s data available across components without passing props down the hierarchy.
 */

import React, { ReactNode, useContext } from 'react'

import product from '../product.json'

const ProductContext = React.createContext({
    title: '',
    version: '',
    author: '',
    country: '',
    support: ''
})

/**
 * Returns the value of the current product context, specified through the nearest ProductProvider.
 * 
 * @see ProductProvider
 */
export const useProduct = () => useContext(ProductContext)

/**
 * A context provider that injects "product.json"'s content as value.
 * The value can then be read via useProduct().
 * 
 * @param props 
 * @see useProduct()
 */
export default function ProductProvider({ children }: ProductProviderProps) {
    return (
        <ProductContext.Provider value={product}>
            {children}
        </ProductContext.Provider>
    )
}

interface ProductProviderProps {
    children: ReactNode
}
