import React, { SyntheticEvent, useState } from 'react'
import { Card, Container, Form, Button, Alert, Spinner, Col, Row } from 'react-bootstrap'
import useAuth, { LoginResult } from '../hooks/Auth'
import useRegistry from '../hooks/Registry'
import { ContactAdmin } from './Util' 

const RegistryUnavailable = () => {
    return (
        <>
            The registry seems unavailable at the moment.
            Come back later or <ContactAdmin /> if the error persists.
        </>
    )
}
const InvalidCredentials = () => {
    return (
        <>
            The registry is available, but the authentication credentials you entered seem invalid.
            Check your spelling or <ContactAdmin /> if you believe this is an error.
        </>
    )
}

interface LoginFailureProps {
    result: LoginResult
}

const LoginFailure = ({ result }: LoginFailureProps) => {
    if (result.success) return null
    return (
        <Alert variant="danger">
            <Alert.Heading>Authentication failed</Alert.Heading>
            {result.error === 'invalid_auth_credentials' && <InvalidCredentials />}
            {result.error === 'registry_unreachable' && <RegistryUnavailable />}
            {result.error === 'unknown_error' && <>UNKNOWN_REQUEST_ERROR</>}
        </Alert>
    )
}

export function LoginInfo() {
    const { user, logout } = useAuth()
    const performLogout = (e: SyntheticEvent) => {
        e.preventDefault()
        logout()
    }
    return (
        <p className="container text-end mt-2">
            Logged in as <strong>{user}</strong>. <a href="/" onClick={performLogout}>Log out</a>
        </p>
    )
}

export default function Login() {
    const { registry } = useRegistry()
    const { login } = useAuth()

    const [loginResult, setLoginResult] = useState<LoginResult|null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const attemptLogin = async (e: SyntheticEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const target = e.target as typeof e.target & {
            user: { value: string },
            password: { value: string }
        }
        const result = await login(target.user.value, target.password.value)
        if (!result.success) {
            setLoginResult(result)
            setIsLoading(false)
        }
    }

    return (
        <Container className="my-5 py-lg-5">
            <Row className="mb-lg-5 pb-lg-5">
                <Col className="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
                    <Card>
                        <Card.Body>
                            <h1 className="text-center mb-5">Authentication Required</h1>
                            {loginResult !== null && !loginResult.success && <LoginFailure result={loginResult} /> }
                            <p>Provide your authentication credentials in order to access <em>{registry}</em>.</p>
                            <Form onSubmit={attemptLogin}>
                                <Form.Group className="my-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control name="user" type="text" placeholder="johndoe" />
                                </Form.Group>
                                <Form.Group className="my-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password" type="password" />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-4 w-100">
                                    {!isLoading ? 'Log in' : <Spinner animation="border"></Spinner>}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <p className="w-100 text-center text-muted mt-2">Need help? <ContactAdmin uppercase />.</p>
                </Col>
            </Row>
        </Container>
    )
}
