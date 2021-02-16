import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import "../css/signin.css";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@material-ui/core";

const passIsValid = (pass1, pass2) => {
  const errors = [];
  if (pass1 != pass2) errors.push("\nPasswords dont match");
  if (pass1.length < 8) errors.push("\nPassword must be at least 8 characters");
  if (!/\d/.test(pass1))
    errors.push("\nPassword must contain at least on digit");
  if (errors.length > 0) return { errors };
  return true;
};

const emailIsValid = (email) => {
  console.log(email);
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const valid = re.test(String(email).toLowerCase());
  if (!valid) return { errors: "invalid email" };
  return true;
};

const Register = (props) => {
  const register = ({ username, email, password1 }) => {
    console.log(username, email, password1);
    const data = { username, email, password: password1 };
    return axios
      .post("/api/users", data)
      .then((response) => {
        const token = response.data.token;
        props.setToken(token);
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
        Register
      </h1>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password1: "",
          password2: "",
        }}
        validate={(values) => {
          const errors = {};
          const passValid = passIsValid(values.password1, values.password2);
          const emailValid = emailIsValid(values.email);
          if (!values.email) {
            errors.email = "Required";
          } else if (emailValid !== true) {
            errors.email = emailValid.errors;
            console.log(emailValid);
          }
          if (!values.username) {
            errors.username = "Required";
          }
          if (!values.password1 || !values.password2) {
            errors.password1 = "Required";
          } else if (passValid !== true) {
            errors.password1 = passValid.errors;
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          register(values).then((err) => {
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
              placeholder="username"
              type="text"
              name="username"
              as={TextField}
            />
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
              name="password1"
              as={TextField}
            />
            <Field
              placeholder="confirm password"
              type="password"
              name="password2"
              as={TextField}
            />
            <ErrorMessage name="password1" component="div" />
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
    </div>
  );
};

export default Register;
