import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { post, get } from '../../services/api';

export default function Navigationbar() {
	const [loggedin, setLoggedState] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [fname, setFname] = useState(null);
	const [lname, setLname] = useState(null);
	const [username, setUsername] = useState(null);
	const [email, setEmail] = useState(null);

	useEffect(() => {
		post('/token/', { username: 'fhenriques', password: 'fabio97' })
			.then(response => {
				setLoggedState(true);
				setAccessToken(response.access);
				setRefreshToken(response.refresh);
				get('/user/', {}, response.access)
					.then(response => {
						setFname(response.results[0].first_name);
						setLname(response.results[0].last_name);
						setUsername(response.results[0].username);
						setEmail(response.results[0].email);
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => console.log(error));
	}, []);

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const logout = () => {
		setLoggedState(false);
		setFname(false);
		setLname(false);
		setUsername(false);
		setEmail(false);
	};

	return (
		<Navbar
			collapseOnSelect
			variant='dark'
			expand='lg'
			style={{ backgroundColor: 'rgb(19, 18, 26)' }}
		>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Woohoo, you're reading this text in a modal!
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleClose}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
			<Container
				handleClose={handleClose}
				handleShow={handleShow}
				show={show}
				setShow={setShow}
			>
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
								<div className={'ml-auto'}>
									<Col>
										{fname} {lname}
									</Col>
									<Col>{email}</Col>
								</div>
								<div className='mr-3'>
									<Image
										width='50'
										height='50'
										roundedCircle
										style={{
											border:
												'3px solid rgb(150, 230, 47)'
										}}
										src='https://avatars2.githubusercontent.com/u/17366849?v=4'
										alt='Profile'
									/>
								</div>
							</Row>
							<Nav.Link
								className='high-bottom ml-3 mt-auto mb-auto'
								onClick={logout}
							>
								<strong>Logout</strong>
							</Nav.Link>
						</Nav>
					) : (
						<Nav className='ml-auto'>
							<Nav.Link onClick={handleShow}>Login</Nav.Link>
						</Nav>
					)}
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
