import { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import MyNav from "./components/MyNav";
import Home from "./components/Home";
import Messages from "./components/Messages";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import "./css/style.css";
import axios from "axios";

import "./css/messages.scss";

const App = (props) => {
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
                  <Register {...props} token={token} setToken={setToken} />
                );
              } else {
                return <Logout {...props} token={token} setToken={setToken} />;
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
            path="/messages"
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
            path="/chat"
            render={(props) => {
              if (token) {
                return <Chat {...props} />;
              } else {
                return <Login token={token} setToken={setToken} {...props} />;
              }
            }}
          />
          <Route
            exact
            path="/profile"
            render={(props) => {
              return (
                <Profile
                  {...user}
                  {...props}
                  setUser={setUser}
                  token={token}
                  setToken={setToken}
                />
              );
            }}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
