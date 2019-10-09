import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import { post, get } from '../../services/api';

export default function Navigationbar() {
	const [loggedin, setLoggedState] = useState(false);
	const [fname, setFname] = useState(null);
	const [lname, setLname] = useState(null);
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);

	const [loginModalShow, setLoginModalShow] = useState(false);
	const handleCloseLogin = () => setLoginModalShow(false);
	const handleShowLogin = () => setLoginModalShow(true);

	const [registerModalShow, setRegisterModalShow] = useState(false);
	const handleCloseRegister = () => setRegisterModalShow(false);
	const handleShowRegister = () => setRegisterModalShow(true);

	const getPerfil = () => {
		get('/user/', {}, localStorage.getItem('@megua:access_token'))
			.then(response => {
				setFname(response.results[0].first_name);
				setLname(response.results[0].last_name);
				setUsername(response.results[0].username);
				setEmail(response.results[0].email);
			})
			.catch(error => {
				console.log(error);
			});
	};

	const login = credentials => {
		post('/token/', credentials)
			.then(response => {
				setLoggedState(true);
				localStorage.setItem('@megua:access_token', response.access);
				localStorage.setItem('@megua:refresh_token', response.refresh);
				getPerfil();
				handleCloseLogin();
			})
			.catch(error => console.log(error));
	};

	const register = data => {
		post('/register/', data)
			.then(response => {
				login({ username: data.username, password: data.password });
				handleCloseRegister();
			})
			.catch(error => console.log(error));
	};

	const logout = () => {
		setLoggedState(false);
		setFname(false);
		setLname(false);
		setUsername(false);
		setEmail(false);
		localStorage.removeItem('@megua:access_token');
		localStorage.removeItem('@megua:refresh_token');
	};

	const handleSubmitLogin = event => {
		event.preventDefault();
		login({
			username: event.target.elements.username.value,
			password: event.target.elements.password.value
		});
	};

	const handleSubmitRegister = event => {
		event.preventDefault();
		register({
			username: event.target.elements.username.value,
			first_name: event.target.elements.fname.value,
			last_name: event.target.elements.lname.value,
			password: event.target.elements.password.value,
			password2: event.target.elements.cpassword.value,
			email: event.target.elements.email.value,
			email2: event.target.elements.cemail.value,
			user_type: event.target.elements.userType.value
		});
	};

	const token = localStorage.getItem('@megua:access_token');
	useState(() => {
		if (token !== null) {
			setLoggedState(true);
			getPerfil();
		}
	}, []);

	return (
		<Navbar
			className='navbar-line fixed-top'
			collapseOnSelect
			variant='dark'
			expand='lg'
			style={{ backgroundColor: 'rgb(19, 18, 26)' }}
		>
			<Modal show={loginModalShow} onHide={handleCloseLogin}>
				<Modal.Header closeButton>
					<Modal.Title>Entrar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id='loginForm' onSubmit={handleSubmitLogin}>
						<Form.Group>
							<Form.Label>Nome de usuário</Form.Label>
							<Form.Control
								type='text'
								name='username'
								placeholder='Nome de usuário'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='password'
								placeholder='Palavra passe'
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button form='loginForm' type='submit' variant='primary'>
						Login
					</Button>
					<Button variant='secondary' onClick={handleCloseLogin}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={registerModalShow} onHide={handleCloseRegister}>
				<Modal.Header closeButton>
					<Modal.Title>Registar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id='registerForm' onSubmit={handleSubmitRegister}>
						<Form.Group>
							<Form.Label>Nome de usuário</Form.Label>
							<Form.Control
								type='text'
								name='username'
								placeholder='Nome de usuário'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='password'
								autocomplete='off'
								placeholder='Palavra passe'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Confirmar palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='cpassword'
								placeholder='Confirmar palavra passe'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Primeiro nome</Form.Label>
							<Form.Control
								type='text'
								name='fname'
								placeholder='Primeiro nome'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Último nome</Form.Label>
							<Form.Control
								name='lname'
								placeholder='Último nome'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='email'
								name='email'
								placeholder='Email'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Confirmar email</Form.Label>
							<Form.Control
								type='email'
								name='cemail'
								autocomplete='off'
								placeholder='Confirmar email'
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Tipo de utilizador</Form.Label>
							<Form.Control as='select' name='userType'>
								<option value='ST'>Estudante</option>
								<option value='PROF'>Professor</option>
							</Form.Control>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button form='registerForm' type='submit' variant='primary'>
						Register
					</Button>
					<Button variant='secondary' onClick={handleCloseRegister}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<Container>
				<Navbar.Brand>
					<Image
						src={require('../../media/logo.png')}
						alt='Brand'
						style={{ height: '3em' }}
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					{loggedin ? (
						<Nav className='ml-auto'>
							<Row>
								<div className='ml-auto text-right'>
									<Col>
										{fname} {lname}
									</Col>
									<Col className='mail-nav'>{email}</Col>
								</div>
								<div className='mr-3'>
									<Image
										width='50'
										height='50'
										roundedCircle
										style={{
											border: '3px solid rgb(4, 211, 97)'
										}}
										src='https://avatars2.githubusercontent.com/u/17366849?v=4'
										alt='Profile'
									/>
								</div>
							</Row>
							<Nav.Link className='button-nav' onClick={logout}>
								<strong>Logout</strong>
							</Nav.Link>
						</Nav>
					) : (
						<>
							<Nav className='ml-auto'>
								<Nav.Link
									className='button-nav'
									onClick={handleShowLogin}
								>
									<strong>Login</strong>
								</Nav.Link>
								<Nav.Link
									className='button-nav'
									onClick={handleShowRegister}
								>
									<strong>Register</strong>
								</Nav.Link>
							</Nav>
						</>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
