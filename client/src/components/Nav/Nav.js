import React from "react";
import { Link } from "react-router-dom";
import { useGlobalState } from "../../config/globalState";
import { logoutUserFromBackend } from "../../services/authServices";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../../data/images/logo-circle-sm.png";

const Navi = () => {
  const { store, dispatch } = useGlobalState();
  const { LoggedInUser } = store;
  console.log("LoggedInUser=>", LoggedInUser);
  const { name, role, _id } = LoggedInUser;

  const logoutUser = () => {
    // !logout user from backend
    logoutUserFromBackend()
      .then((data) => {
        console.log("data=>", data);
        dispatch({
          type: "setLoggedInUser",

          data: {},
        });
      })
      .catch((error) => console.log(error));
  };

  const showLogOutOrSignUp = (name) => {
    if (name) {
      return (
        <Nav>
          <Navbar.Text>Welcome</Navbar.Text>
          <NavDropdown title={name} id="basic-nav-dropdown">
            <NavDropdown.Item
              as={Link}
              to={{
                pathname: `/users/edit/${_id}`,
                state: { member: LoggedInUser },
              }}
            >
              Account
            </NavDropdown.Item>

            <NavDropdown.Item as={Link} onClick={logoutUser} to="/">
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Nav.Link as={Link} data-testid="register" to="/auth/register">
            SignUp
          </Nav.Link>
          <Nav.Link as={Link} to="/auth/login">
            Login
          </Nav.Link>
        </Nav>
      );
    }
  };

  return (
    <div>
      <div id="navbar-wrapper">
        <Nav id="navbar-top-half">
          <Nav.Link as={Link} to="/">
            <img id="logo" src={Logo} />
          </Nav.Link>
          <h1 className="disappear-class" id="title">
            South of the River Potters Club
          </h1>
          <div id="signup-login">{showLogOutOrSignUp(name)}</div>
        </Nav>

        <Navbar className="navbar-custom" expand="lg">
          <Navbar.Collapse id="basic-navbar-nav">
            <div id="navbar-middle-container"></div>
            <Nav className="mr-auto move-down" id="navbar-custom-links">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/classes">
                Classes
              </Nav.Link>
              <Nav.Link as={Link} to="/photos">
                Gallery
              </Nav.Link>
              {role === "Admin" ? (
                <Nav.Link as={Link} to="/users">
                  Members
                </Nav.Link>
              ) : null}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Navbar>
      </div>
    </div>
  );
};

export default Navi;
