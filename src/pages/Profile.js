import React, { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Button } from "react-bootstrap";
import { auth } from "../utils/db";

function Profile() {
  const user = useContext(UserContext);

  function resetPassword() {
    auth
      .sendPasswordResetEmail(auth.currentUser.email)
      .then(() => {
        alert("Please check your email for furthuer instructions");
      })
      .catch(err => console.error(err.code));
  }

  return (
    <div className="Main">
      <div className="box user-info">
        <div>
          <label>First Name:</label> {user.firstname}
        </div>
        <div>
          <label>Last Name:</label> {user.lastname}
        </div>
        <div>
          <label>School:</label> {user.school} High School
        </div>
        <div>
          <label>Email:</label> {user.email}
        </div>
      </div>
      <div>
        <h3>Reset Password?</h3>
        <Button onClick={resetPassword}>Reset Password</Button>
      </div>
    </div>
  );
}

export default Profile;
