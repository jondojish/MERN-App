import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import "../css/signin.css";
import axios from "axios";
import { v4 as uuid } from "uuid";

const Login = (props) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const login = () => {
    const data = { email, password };
    const headers = {
      "Content-Type": "application/json",
      Authorization: props.token,
    };
    axios
      .post("/api/auth", data, { headers })
      .then((response) => {
        const token = response.data.token;
        props.setToken(token);
        console.log(token);
        props.history.push("/profile");
      })
      .catch((err) => {
        setErrors([err.response.data.msg]);
        console.log(err.response.data.msg);
      });
  };

  let errorTags = [];

  errors.map((err) => {
    errorTags.push(<p key={uuid()}>{err}</p>);
  });

  return (
    <div className="container">
      <form
        className="form-signin"
        onSubmit={(event) => {
          setEmail("");
          setPass("");
          setErrors([]);
          login();
          event.preventDefault();
        }}
      >
        <img className="mb-4" src={logo} alt="logo" width="130" />
        <h1 id="header_text" className="h3 mb-3 font-weight-normal">
          Login
        </h1>

        <input
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          type="email-username"
          className="form-control"
          placeholder="Email address"
          required
          autoFocus
        />

        <input
          name="passwor1"
          value={password}
          onChange={(event) => {
            setPass(event.target.value);
          }}
          type="password"
          style={{ marginBbottom: "-1px" }}
          className="form-control"
          placeholder="Password"
          required
          autoFocus
        />

        <div style={{ lineHeight: "10px" }}>{errorTags}</div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Login
        </button>
        <p style={{ color: "white" }}>
          Create an account{" "}
          <a
            href=""
            onClick={() => {
              props.history.push("/register");
            }}
          >
            here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
