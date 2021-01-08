import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import Footer from '../generic/Footer'
import RepositoryDataView from './RepositoryDataView'
import Login, { LoginInfo } from './Login'
import ProductProvider from '../generic/ProductProvider'
import { Help } from './Util'
import { useAuth } from '../contexts/AuthProvider'

/**
 * RegiCare's main component.
 * 
 */
function App({ registry, admin }: { registry: string, admin: string} ) {

    const { user } = useAuth()

    return (
        <ProductProvider>
            {!user ? // Restrict all access to authenticated users only
                <Login registry={registry} admin={admin} /> 
            : 
                <Router>
                    <LoginInfo />
                    <Switch>
                        <Route path="/help" exact>
                            <Help admin={admin} />
                        </Route>
                        <RepositoryDataView registry={registry} admin={admin}/>
                    </Switch>
                </Router>
            }
            <Footer />
        </ProductProvider>
    )
}

export default App;
