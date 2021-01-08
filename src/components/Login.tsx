import React, { SyntheticEvent, useState } from 'react'
import { Card, Container, Form, Button, Alert, Spinner, Col, Row } from 'react-bootstrap'
import { LoginResult, useAuth } from '../contexts/AuthProvider'
import { ContactAdmin } from './Util' 

const RegistryUnavailable = ({ admin } : { admin: string }) => (
    <>
        The registry seems unavailable at the moment.
        Come back later or <ContactAdmin admin={admin} /> if the error persists.
    </>
)
const InvalidCredentials = ({ admin } : { admin: string }) => (
    <>
        The registry is available, but the authentication credentials you entered seem invalid.
        Check your spelling or <ContactAdmin admin={admin} /> if you believe this is an error.
    </>
)

interface AuthenticationFailureProps {
    result: LoginResult,
    admin: string
}

const LoginFailure = ({ result, admin }: AuthenticationFailureProps) => {
    if (result.success) return null
    return (
        <Alert variant="danger">
            <Alert.Heading>Authentication failed</Alert.Heading>
            {result.error === 'invalid_auth_credentials' && <InvalidCredentials admin={admin} />}
            {result.error === 'registry_unreachable' && <RegistryUnavailable admin={admin} />}
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

interface LoginProps {
    registry: string,
    admin: string
}

export default function Login({ registry, admin }: LoginProps) {
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
        setLoginResult(await login(target.user.value, target.password.value))
        setIsLoading(false)
    }

    return (
        <Container className="my-5 py-lg-5">
            <Row className="mb-lg-5 pb-lg-5">
                <Col className="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
                    <Card>
                        <Card.Body>
                            <h1 className="text-center mb-5">Authentication Required</h1>
                            {loginResult !== null && !loginResult.success && <LoginFailure result={loginResult} admin={admin} /> }
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
                    <p className="w-100 text-center text-muted mt-2">Need help? <ContactAdmin admin={admin} uppercase />.</p>
                </Col>
            </Row>
        </Container>
    )
}
