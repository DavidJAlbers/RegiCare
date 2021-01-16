import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import Footer from '../generic/Footer'
import RepositoryDataView from './RepositoryDataView'
import Login, { LoginInfo } from './Login'
import { Help } from './Util'
import useAuth from '../hooks/Auth'

/**
 * RegiCare's main component.
 * 
 */
function App() {

    const { user } = useAuth()

    return (
        <>
            {!user ? // Restrict all access to authenticated users only
                <Login /> 
            : 
                <Router>
                    <LoginInfo />
                    <Switch>
                        <Route exact path="/help" component={Help} />
                        <RepositoryDataView />
                    </Switch>
                </Router>
            }
            <Footer />
        </>
    )
}

export default App;
