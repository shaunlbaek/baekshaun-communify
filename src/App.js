import React, { useState } from "react";
import Discussion from "./pages/Discussions/Discussion";
import LoginScreen from "./pages/LoginScreen";
import { Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import UserContext from "./contexts/UserContext";
import Profile from "./pages/Profile";

import { ResourceHome, ResourceChoose } from "./pages/ResourceHome";
import { ResourceList } from "./pages/ResourceList";
import Viewer from "./pages/Discussions/Viewer";
import Footer from "./components/Footer";
import PostWrite from "./pages/Discussions/PostWrite";
import ResourceEdit from "./pages/Resources/ResourceEdit";

function App() {
  let userCtxCache = localStorage.getItem("userCtx");

  let [userCtx, setUserCtx] = useState(
    userCtxCache ? JSON.parse(userCtxCache) : undefined
  );

  if (!userCtx) return <LoginScreen setUserCtx={setUserCtx} />;
  //if (userCtx && !userCtx.hasOwnProperty("schoolId"))
  //   return <EnterSchool setUserCtx={setUserCtx} userCtx={userCtx} />;
  return (
    <div className="App">
      <UserContext.Provider value={userCtx}>
        <Nav setUserCtx={setUserCtx} />

        <div className="main">
          <Switch>
            <Route exact path="/" component={ResourceHome} />
            <Route path="/resource/edit/:id" component={ResourceEdit} />
            <Route
              exact
              path="/resource/:subjectName"
              component={ResourceChoose}
            />
            <Route
              exact
              path="/resource/:subjectName/:className"
              component={ResourceList}
            />
            <Route exact path="/discussion" component={Discussion} />
            <Route exact path="/discussion/edit/:id" component={PostWrite} />
            <Route exact path="/discussion/:id" component={Viewer} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/dicussion/write" component={PostWrite} />
          </Switch>
        </div>
        <Footer />
      </UserContext.Provider>
    </div>
  );
}

export default App;
