import React from "react";
import "./App.css";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import logo from "./media/logo.png";

function App() {
	return (
		<>
			<Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
				<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="#features">Features</Nav.Link>
						<Nav.Link href="#pricing">Pricing</Nav.Link>
						<NavDropdown
							title="Dropdown"
							id="collasible-nav-dropdown"
						>
							<NavDropdown.Item href="#action/3.1">
								Action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">
								Something
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action/3.4">
								Separated link
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						<Nav.Link href="#deets">More deets</Nav.Link>
						<Nav.Link eventKey={2} href="#memes">
							Dank memes
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Container className="text-center">
				<Image src={logo} width={500} fluid />
			</Container>
			<Container>
				<Row>
					<Col md={12}>
						<InputGroup>
							<FormControl
								placeholder="Search for..."
								aria-label="Search for..."
							/>
							<InputGroup.Append>
								<Button>Go!</Button>
							</InputGroup.Append>
						</InputGroup>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default App;
