import React, { useState } from "react";
import { auth, db } from "../utils/db";
import "./LoginScreen.scss";

function LoginScreen({ setUserCtx }) {
  let [isLogin, setIsLogin] = useState(true);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [firstname, setFirstName] = useState("");
  let [lastname, setLastName] = useState("");
  let [school, setSchool] = useState("");
  let [errMsg, setErrMsg] = useState(undefined);

  return (
    <div className="LoginScreen">
      <div className="upper">
        <h1>Communify v1.0.2</h1>
      </div>
      <div className="lower">
        <form
          className="form1 vertical"
          onSubmit={async ev => {
            ev.preventDefault();
            setErrMsg(undefined);

            try {
              if (isLogin) {
                let userRef = await auth.signInWithEmailAndPassword(
                  email,
                  password
                );
                let userData = await db
                  .collection("users")
                  .doc(userRef.user.uid)
                  .get();

                let userCtx = {
                  uid: userRef.user.uid,
                  email: userRef.user.email,
                  firstname: userData.data().firstname,
                  lastname: userData.data().lastname,
                  school: userData.data().school
                };
                localStorage.setItem("userCtx", JSON.stringify(userCtx));
                setUserCtx(userCtx);
              } else {
                if (firstname.length < 3) {
                  setErrMsg("Please enter your first name");
                  return;
                }
                if (lastname.length < 3) {
                  setErrMsg("Please enter your last name");
                  return;
                }

                let userRef = await auth.createUserWithEmailAndPassword(
                  email,
                  password
                );

                await db
                  .collection("users")
                  .doc(userRef.user.uid)
                  .set({
                    email,
                    firstname,
                    lastname,
                    school
                  });
              }
            } catch (err) {
              setErrMsg(err.message);
            }
          }}
        >
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          {errMsg && <div className="err-msg">{errMsg}</div>}
          {!isLogin && (
            <React.Fragment>
              <label>First Name</label>
              <input
                value={firstname}
                onChange={ev => setFirstName(ev.target.value)}
              />
              <label>Last Name</label>
              <input
                value={lastname}
                onChange={ev => setLastName(ev.target.value)}
              />
              <label>School</label>
              <select
                onChange={ev => {
                  setSchool(ev.target.value);
                }}
              >
                <option>---choose your school---</option>
                {["Portola", "Other"].map(s => (
                  <option value={s}>{s}</option>
                ))}
              </select>
            </React.Fragment>
          )}
          <label>Email</label>
          <input
            type="text"
            placeholder="your@email.com"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}
          />

          <button className="primary btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="as-a" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "If you don't have an account, please sign up"
            : "If you already have an account, please sign in"}
        </div>
        <ul>
          <div>Tom Hank</div>
          <li>Email: tom@guest.com</li>
          <li>Password: 123456</li>

          <div>Bob Bill</div>
          <li>Email: bob@guest.com</li>
          <li>Password: 123456</li>
        </ul>
      </div>
    </div>
  );
}

export default LoginScreen;
