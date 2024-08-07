import { useContext } from "react";
import AuthContext from "src/utils/auth-context";
import { HOST } from "src/common/constants";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, Outlet, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  async function signOut(request) {
    try {
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      } else {
        auth.setAuthState({
          user: null,
          isLoggedIn: false,
        });
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const logoutRequest = new Request(`${HOST}/logout`, {
    method: "DELETE",
    headers: {
      authorization: `bearer ${localStorage.getItem("token")}`,
    },
  });

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            BooksDB
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav>
            <Nav>
              {auth.isLoggedIn ? (
                <>
                  {auth.user.is_admin === 1 && (
                    <Nav.Link as={Link} to="/users">
                      Users
                    </Nav.Link>
                  )}
                  <Nav.Link as={Link} to="/books">
                    Books
                  </Nav.Link>
                  <Nav.Link onClick={() => signOut(logoutRequest)}>
                    Log Out
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default NavbarComponent;
