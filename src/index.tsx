import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { AuthProvider } from './hooks/Auth'
import ProductProvider from './hooks/Product'

ReactDOM.render((
    <ProductProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ProductProvider>
),document.getElementById('root'))
