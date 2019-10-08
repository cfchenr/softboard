import React from "react";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Navigationbar() {
  return (
    // <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
    // 	<Container>
    // 		<Navbar.Brand href="/">MEGUA</Navbar.Brand>
    // 		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
    // 		<Navbar.Collapse id="responsive-navbar-nav">
    // 			<Nav className="ml-auto">
    // 				<Nav.Link href="/Login">Login</Nav.Link>
    // 			</Nav>
    // 		</Navbar.Collapse>
    // 	</Container>
    // </Navbar>

    <Navbar collapseOnSelect expand="md" className="fixed-top navbar">
      <Container className="navbar-content">
        <Navbar.Brand className="navbar-brand">
          {/* TODO: add image */}
          <img src={window.location.origin + "/static/img/logo.png"} alt="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <div className="navbar-perfil">
              <div>
                <span>Cláudio Henriques</span>
                <span>c.henriques@ua.pt</span>
              </div>
              <img
                src="https://avatars2.githubusercontent.com/u/17366849?v=4"
                alt="Profile"
              ></img>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
