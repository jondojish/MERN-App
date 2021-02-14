import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import "../css/signin.css";
import axios from "axios";
import { v4 as uuid } from "uuid";

const passIsValid = (pass1, pass2) => {
  const errors = [];
  if (pass1 != pass2) errors.push("Passwords dont match");
  if (pass1.length < 8) errors.push("Password must be at least 8 characters");
  if (!/\d/.test(pass1)) errors.push("Password must contain at least on digit");
  if (errors.length > 0) return { errors };
  return true;
};

const emailIsValid = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(email).toLowerCase());
  if (!valid) return { errors: "invalid email" };
  return true;
};

const Register = (props) => {
  const register = () => {
    const data = { username, email, password: pass1 };
    axios
      .post("/api/users", data)
      .then((response) => {
        const token = response.data.token;
        props.setToken(token);
        props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        // setErrors([...errors, err.response.data.msg]);
        // console.log(err.response.data.msg);
      });
  };

  const [errors, setErrors] = useState([]);
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const errorTags = [];

  errors.map((err) => {
    errorTags.push(<p key={uuid()}>{err}</p>);
  });

  return (
    <div className="container">
      <form
        onSubmit={(event) => {
          setUser("");
          setEmail("");
          setPass1("");
          setPass2("");
          setErrors([]);
          const passValid = passIsValid(pass1, pass2);
          const emailValid = emailIsValid(email);
          if (passValid === true && emailValid === true) {
            register();
          } else {
            if (passValid !== true) {
              setErrors((prevErr) => [...prevErr, ...passValid.errors]);
            }
            if (emailValid !== true) {
              setErrors((prevErr) => [...prevErr, emailValid.errors]);
            }
          }
          event.preventDefault();
        }}
        className="form-signin"
      >
        <img className="mb-4" src={logo} alt="logo" width="130" />
        <h1 id="header_text" className="h3 mb-3 font-weight-normal">
          Register
        </h1>

        <input
          name="username"
          value={username}
          onChange={(event) => {
            setUser(event.target.value);
          }}
          type="email-username"
          id="inputUsername"
          className="form-control"
          placeholder="Username"
          required
          autoFocus
        />

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
          value={pass1}
          onChange={(event) => {
            setPass1(event.target.value);
          }}
          type="password"
          style={{ marginBbottom: "-1px" }}
          className="form-control"
          placeholder="Password"
          required
          autoFocus
        />

        <input
          name="password2"
          value={pass2}
          onChange={(event) => {
            setPass2(event.target.value);
          }}
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          required
        />
        <div style={{ lineHeight: "20px" }}>{errorTags}</div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
