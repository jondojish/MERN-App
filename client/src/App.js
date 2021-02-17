import { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import MyNav from "./components/MyNav";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Confirmation from "./components/Confirmation";
import "./css/style.css";
import "./css/signin.css";
import axios from "axios";

import "./css/messages.scss";

const App = (props) => {
  document.title = "Home";

  const [tempUser, setTempUser] = useState(null);

  const [confirmationCode, setConfirmationCode] = useState(null);

  const localToken = window.localStorage.getItem("token");
  const [token, setToken] = useState(localToken !== null ? localToken : "");

  const [user, setUser] = useState(null);

  useEffect(() => {
    window.localStorage.setItem("token", token);
    const headers = { Authorization: token };
    axios
      .get("/api/users", { headers: headers })
      .then((currUser) => {
        setUser(currUser.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <div className="App">
      <Router>
        <Route
          path="/"
          render={(props) => {
            return <MyNav token={token} {...props} />;
          }}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => {
              return <Home {...props} token={token}></Home>;
            }}
          />
          <Route
            exact
            path="/register"
            render={(props) => {
              if (!token) {
                return (
                  <Register
                    setTempUser={setTempUser}
                    setConfirmationCode={setConfirmationCode}
                    {...props}
                    token={token}
                    setToken={setToken}
                  />
                );
              } else {
                return <Logout {...props} token={token} setToken={setToken} />;
              }
            }}
          />
          <Route
            exact
            path="/confirmation"
            render={(props) => {
              if (confirmationCode) {
                return (
                  <Confirmation
                    {...props}
                    tempUser={tempUser}
                    setTempUser={setTempUser}
                    setToken={setToken}
                    confirmationCode={confirmationCode}
                    setConfirmationCode={setConfirmationCode}
                  />
                );
              } else {
                return <Home {...props} token={token} setToken={setToken} />;
              }
            }}
          />
          <Route
            exact
            path="/login"
            render={(props) => {
              if (!token) {
                return <Login {...props} token={token} setToken={setToken} />;
              } else {
                return (
                  <Logout
                    {...user}
                    {...props}
                    token={token}
                    setToken={setToken}
                  />
                );
              }
            }}
          />
          <Route
            exact
            path="/messaging"
            render={(props) => {
              if (token) {
                return (
                  <Messages
                    token={token}
                    setToken={setToken}
                    {...user}
                    {...props}
                  />
                );
              } else {
                return <Login token={token} setToken={setToken} {...props} />;
              }
            }}
          />
          <Route
            exact
            path="/profile"
            render={(props) => {
              if (token) {
                return (
                  <Profile
                    {...user}
                    {...props}
                    setUser={setUser}
                    token={token}
                    setToken={setToken}
                  />
                );
              } else {
                return <Login token={token} setToken={setToken} {...props} />;
              }
            }}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
