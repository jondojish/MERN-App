import { useState, useEffect } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import MyNav from "./components/MyNav";
import Home from "./components/Home";
import "./css/style.css";
import axios from "axios";

const App = () => {
  const localToken = window.localStorage.getItem("token");
  const [token, setToken] = useState(localToken !== null ? localToken : "");

  useEffect(() => {
    window.localStorage.setItem("token", token);
  }, [token]);

  const [user, setUser] = useState({});
  useEffect(() => {
    const headers = { Authorization: token };
    axios
      .get("/api/users", { headers: headers })
      .then((currUser) => {
        console.log(currUser.data);
        setUser(currUser.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <div className="App">
      <MyNav token={token} />
      <Router>
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
                    username={user.username}
                    {...props}
                    token={token}
                    setToken={setToken}
                  />
                );
              }
            }}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
