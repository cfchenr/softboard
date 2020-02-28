import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import ThemeSwitcher from './ThemeSwitcher';

import { post, get } from '../../services/api';

export default function Navigationbar(props) {
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

	const [authError, setAuthError] = useState(null);
	const [registerError, setRegisterError] = useState(null);
	const [emailsMustMatch, setEmailsMustMatch] = useState(false);
	const [passwordsMustMatch, setPasswordsMustMatch] = useState(false);
	const [userExists, setUserExists] = useState(false);

	const getPerfil = () => {
		get(
			'/user/' + localStorage.getItem('@megua:id') + '/',
			{},
			localStorage.getItem('@megua:access_token')
		)
			.then(response => {
				setFname(response.results[0].first_name);
				setLname(response.results[0].last_name);
				setUsername(response.results[0].username);
				setEmail(response.results[0].email);
				localStorage.setItem('@megua:username', username);
			})
			.catch(error => {
				//TODO Tratamento de erros
				console.log(error);
				if (error.status === 401) {
					logout();
				}
			});
	};

	//TODO: Rever o token refresh

	const login = credentials => {
		post('/token/', credentials)
			.then(response => {
				localStorage.setItem('@megua:loggedin', true);
				localStorage.setItem('@megua:id', response.id);
				localStorage.setItem('@megua:access_token', response.access);
				localStorage.setItem('@megua:refresh_token', response.refresh);
				window.location.reload();
			})
			.catch(error => {
				//TODO Tratamento de erros
				console.log(error);
				if (error.status >= 500) {
					setAuthError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (error.status === 404) {
					setAuthError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (error.status === null) {
					setAuthError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (
					error.data.detail ===
					'No active account found with the given credentials'
				) {
					setAuthError('Nome do usuário ou password errados.');
				}
			});
	};

	const register = data => {
		post('/register/', data)
			.then(response => {
				login({ username: data.username, password: data.password });
				setRegisterError(null);
				setEmailsMustMatch(false);
				setUserExists(false);
				setPasswordsMustMatch(false);
				handleCloseRegister();
			})
			.catch(error => {
				//TODO Tratamento de erros
				console.log(error);
				setEmailsMustMatch(false);
				setPasswordsMustMatch(false);
				setUserExists(false);
				setRegisterError(null);
				if (error.status >= 500) {
					setRegisterError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (error.status === 404) {
					setRegisterError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (error.status === null) {
					setRegisterError(
						'Ocorreu um problema interno. Por favor tente novamente mais tarde.'
					);
				} else if (error.data) {
					for (let item in error.data) {
						switch (error.data[item][0]) {
							case 'Emails must match':
								setEmailsMustMatch(true);
								break;
							case 'Passwords must match':
								setPasswordsMustMatch(true);
								break;
							case 'user with this username already exists.':
								setUserExists(true);
								break;
							default:
								break;
						}
					}
				}
			});
	};

	const logout = () => {
		localStorage.removeItem('@megua:loggedin');
		localStorage.removeItem('@megua:id');
		localStorage.removeItem('@megua:access_token');
		localStorage.removeItem('@megua:refresh_token');
		window.location.reload();
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
			user_type: 'ST'
		});
	};

	const token = localStorage.getItem('@megua:access_token');
	useState(() => {
		if (token !== null) {
			setLoggedState(true);
			getPerfil();
		}
	}, []);

	const handleSubmit = event => {
		event.preventDefault();
		props.setSearch(event.target.elements.search.value);
	};

	return (
		<Navbar
			className='navbar-line fixed-top'
			collapseOnSelect
			variant='dark'
			expand='lg'
			style={{ backgroundColor: '--var(dark-color)' }}>
			<Modal show={loginModalShow} onHide={handleCloseLogin}>
				<Modal.Header closeButton>
					<Modal.Title>Entrar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id='loginForm' onSubmit={handleSubmitLogin}>
						{authError && (
							<Alert variant={'danger'}>{authError}</Alert>
						)}

						<Form.Group>
							<Form.Label>Nome de usuário</Form.Label>
							<Form.Control
								type='text'
								name='username'
								placeholder='Nome de usuário'
								required
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='password'
								placeholder='Palavra passe'
								required
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button form='loginForm' type='submit' variant='primary'>
						Entrar
					</Button>
					<Button variant='secondary' onClick={handleCloseLogin}>
						Cancelar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={registerModalShow} onHide={handleCloseRegister}>
				<Modal.Header closeButton>
					<Modal.Title>Registar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id='registerForm' onSubmit={handleSubmitRegister}>
						{registerError &&
							registerError.split(';').map(error => {
								return (
									<Alert variant={'danger'}>{error}</Alert>
								);
							})}

						<Form.Group>
							<Form.Label>Nome de usuário</Form.Label>
							<Form.Control
								type='text'
								name='username'
								placeholder='Nome de usuário'
								isInvalid={userExists}
								required
							/>
							<Form.Control.Feedback type='invalid'>
								Já existe um usuário com este nome
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>Palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='password'
								placeholder='Palavra passe'
								required
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Confirmar palavra passe</Form.Label>
							<Form.Control
								type='password'
								name='cpassword'
								autoComplete='confirm-password'
								placeholder='Confirmar palavra passe'
								isInvalid={passwordsMustMatch}
								required
							/>
							<Form.Control.Feedback type='invalid'>
								As passwords devem coincidir
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>Primeiro nome</Form.Label>
							<Form.Control
								type='text'
								name='fname'
								placeholder='Primeiro nome'
								required
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Último nome</Form.Label>
							<Form.Control
								name='lname'
								placeholder='Último nome'
								required
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='email'
								name='email'
								placeholder='Email'
								required
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Confirmar email</Form.Label>
							<Form.Control
								type='email'
								name='cemail'
								autoComplete='confirm-email'
								placeholder='Confirmar email'
								isInvalid={emailsMustMatch}
								required
							/>
							<Form.Control.Feedback type='invalid'>
								Os emails devem coincidir
							</Form.Control.Feedback>
						</Form.Group>
						{/*<Form.Group>
              <Form.Label>Tipo de utilizador</Form.Label>
              <Form.Control as="select" name="userType">
                <option value="ST">Estudante</option>
                <option value="PROF">Professor</option>
              </Form.Control>
            </Form.Group>*/}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button form='registerForm' type='submit' variant='primary'>
						Registar
					</Button>
					<Button variant='secondary' onClick={handleCloseRegister}>
						Cancelar
					</Button>
				</Modal.Footer>
			</Modal>

			<Container>
				<Navbar.Brand href='/'>
					<div style={{ color: 'var(--brand-color)' }}>Home</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Navbar.Collapse id='basic-navbar-nav'>
					<Form className='ml-auto' onSubmit={handleSubmit} inline>
						<FormControl
							type='text'
							placeholder='Pesquisar'
							className=' mr-sm-2'
							name='search'
						/>
						<Button type='submit'>Pesquisar</Button>
						<Button href='/' className='ml-2'>
							<i class='fa fa-trash fa-1x' />
						</Button>
					</Form>
					{loggedin ? (
						<Nav className='ml-auto'>
							<Nav.Link className='button-nav' href='/dashboard/'>
								<strong>Dashboard</strong>
							</Nav.Link>
							<Row>
								<div className='ml-auto text-right'>
									<Col>
										{fname} {lname}
									</Col>
									<Col className='mail-nav'>{email}</Col>
								</div>
								{/*<div className="mr-3">
                  <Image
                    width="50"
                    height="50"
                    roundedCircle
                    style={{
                      border: "3px solid rgb(4, 211, 97)"
                    }}
                    src="https://avatars2.githubusercontent.com/u/17366849?v=4"
                    alt="Profile"
                  />
                </div>*/}
							</Row>
							<Nav.Link className='button-nav' onClick={logout}>
								<strong>Logout</strong>
							</Nav.Link>
						</Nav>
					) : (
						<Nav className='ml-auto'>
							<Nav.Link
								className='button-nav'
								onClick={handleShowLogin}>
								<strong>Entrar</strong>
							</Nav.Link>
							<Nav.Link
								className='button-nav'
								onClick={handleShowRegister}>
								<strong>Registar</strong>
							</Nav.Link>
						</Nav>
					)}
					<ThemeSwitcher />
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
