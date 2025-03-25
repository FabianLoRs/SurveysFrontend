import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { loginUser } from '../Services/UserService';
import { useAuthDispatch } from '../context/authContext';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const authDispatch = useAuthDispatch();

    const login = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            setError("");
            const res = await loginUser(email, password);
            const token = res.data.token;
            authDispatch({
                type: 'login',
                token
            });
        } catch (errors: any) {
            if (errors.response) {
                errors.response.status === 403 && setError("No se puede iniciar sesión.");
            }
            // setError(errors.response.data.errors);
        }
    }

    return (
        <Container>
            <Row>
                <Col lg="5" md="10" sm="10" className="mx-auto">
                    <Card className="mt-5">
                        <Card.Body>
                            <h4>Iniciar sesión</h4><hr />
                            
                            <Form onSubmit={login}>                         
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="email" 
                                        placeholder="e.j. john@gmail.com">
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password" placeholder="*********">
                                    </Form.Control>
                                </Form.Group>
                                <Button type="submit">Iniciar sesión</Button>
                            </Form>

                            <Alert className="mt-4" show={!!error} variant="danger">{error}</Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;