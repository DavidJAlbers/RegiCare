import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import AuthProvider from './contexts/AuthProvider';

// TODO Think of a proper source to get these from
const registry = "registry.davidjalbers.de"
const admin = "mailto:x@y.com"

ReactDOM.render((
    <AuthProvider registry={registry}>
        <App registry={registry} admin={admin} />
    </AuthProvider>
),document.getElementById('root'));
