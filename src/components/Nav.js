import React, { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import "./Nav.scss";
import { auth } from "../utils/db";
import { Link, withRouter } from "react-router-dom";
// import { Navbar, NavDropdown, Nav } from "react-bootstrap";

function Nav({ setUserCtx, location }) {
  let userCtx = useContext(UserContext);
  let [showUserMenu, setShowUserMenu] = useState(false);

  let title = "";
  switch (location.pathname) {
    case "/":
      title = `Welcome Back, ${userCtx.firstname} ${userCtx.lastname}!`;
      break;
    case "/discussion":
      title = `Discussion`;
      break;
    default:
      title = "";
  }

  return (
    <nav className="Nav">
      <div className="container">
        <div className="bar">
          <Link className="a" to="/">
            Home
          </Link>
          <Link to="/discussion">Discussion</Link>

          <div className="spacer" />

          <div className="user-menu">
            <i
              className="fas fa-user"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            &nbsp;
            {userCtx.firstname} {userCtx.lastname}
            {showUserMenu && (
              <div className="user-sub-menu">
                <a className="profile" href="/profile">
                  <div>Profile</div>
                </a>

                <div
                  className="as-a"
                  onClick={() => {
                    auth.signOut();
                    setUserCtx(undefined);
                    localStorage.removeItem("userCtx");
                  }}
                >
                  Sign Out
                </div>
              </div>
            )}
          </div>
        </div>

        <h1> {title} </h1>
      </div>
    </nav>
  );
}

// function MyNav({ setUserCtx }) {
//   let userCtx = useContext(UserContext);
//   return (
//     <Navbar className="top-menu" expand="lg">
//       <Navbar.Collapse className="dropdown-menu">
//         <Nav>
//           <Link className="a" to="/">
//             Home
//           </Link>
//           <Link to="/category">Category</Link>
//           <Link to="/connect">Connect</Link>
//           Signed in as : {userCtx.firstname} {userCtx.lastname}
//           <NavDropdown>
//             <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
//             <NavDropdown.Divider />
//             <NavDropdown.Item
//               onClick={() => {
//                 auth.signOut();
//                 setUserCtx(undefined);
//                 localStorage.removeItem("userCtx");
//               }}
//             >
//               Signout
//             </NavDropdown.Item>
//           </NavDropdown>
//         </Nav>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// }

export default withRouter(Nav);
