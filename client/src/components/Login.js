import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import "../css/signin.css";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@material-ui/core";

const Login = (props) => {
  document.title = "Login";

  const submitLogin = ({ email, password }) => {
    const data = { email, password };
    const headers = {
      "Content-Type": "application/json",
      Authorization: props.token,
    };
    return axios
      .post("/api/auth", data, { headers })
      .then((response) => {
        const token = response.data.token;
        props.setToken(token);
        console.log(token);
        return null;
      })
      .catch((err) => {
        const error = err.response.data.msg;
        return error;
      });
  };

  const [submitError, setSubmitError] = useState(null);
  return (
    <div
      style={{
        textAlign: "center",
      }}
      className="form-signin"
    >
      <img className="mb-4" src={logo} alt="logo" width="130" />
      <h1 id="header_text" className="h3 mb-3 font-weight-normal">
        Login
      </h1>
      <Formik
        initialValues={{
          email: "",
          password1: "",
        }}
        validate={(values) => {
          var errors = {};
          if (!values.email) {
            console.log(errors);
            errors.email = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          submitLogin(values).then((err) => {
            if (err) {
              setSubmitError(err);
            } else {
              props.history.push("/profile");
            }
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              placeholder="email"
              type="email"
              name="email"
              as={TextField}
            />
            <ErrorMessage name="email" component="div" />
            <Field
              placeholder="password"
              type="password"
              name="password"
              as={TextField}
            />
            <ErrorMessage name="password" component="div" />
            <ErrorMessage name="login" component="div" />
            <p>{submitError}</p>
            <div>
              <Button
                style={{ marginTop: "15px" }}
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <p>
        Create an account{" "}
        <a
          style={{ color: "blue" }}
          onClick={() => {
            props.history.push("/register");
          }}
        >
          here
        </a>
      </p>
    </div>
  );
};

export default Login;
