import React, { useState, useEffect } from "react";
import logo from "../images/logo.png";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@material-ui/core";

const checkTaken = ({ username, email }) => {
  return axios
    .get(`/api/users/taken/${username}/${email}`)
    .then((response) => {
      const taken = response.data.taken;
      console.log(taken);
      return taken;
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendCode = (email) => {
  return axios
    .get(`/api/auth/email/${email}`)
    .then((response) => {
      const code = response.data.code;
      return code;
    })
    .catch((err) => {
      console.log(err);
    });
};

const passIsValid = (pass1, pass2) => {
  const errors = [];
  if (pass1 != pass2) errors.push("\nPasswords dont match");
  if (pass1.length < 8) errors.push("\nPassword must be at least 8 characters");
  if (!/\d/.test(pass1))
    //  chack for at least 1 digit
    errors.push("\nPassword must contain at least on digit");
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
  const [submitError, setSubmitError] = useState(null);

  const fieldStyle = { minWidth: "75%" };

  return (
    <div
      style={{
        textAlign: "center",
        minWidth: "350px",
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

          checkTaken(values).then((taken) => {
            if (!taken) {
              // stores the user in state then saves user when confirmation code is entered
              props.setTempUser({
                username: values.username,
                email: values.email,
                password: values.password1,
              });
              sendCode(values.email)
                .then((code) => {
                  console.log(code);
                  props.setConfirmationCode(code);
                  props.history.push("/confirmation");
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              setSubmitError("Username or Email taken");
            }
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginRight: "53%" }}>
              <label>Username:</label>
            </div>
            <Field
              style={{ ...fieldStyle, marginTop: "-10px" }}
              placeholder="username"
              type="text"
              name="username"
              as={TextField}
            />
            <div
              style={{
                marginRight: "63%",
                marginBottom: "0px",
                marginTop: "10px",
              }}
            >
              <label>Email:</label>
            </div>
            <Field
              style={{ ...fieldStyle, marginTop: "-10px" }}
              placeholder="email"
              type="email"
              name="email"
              as={TextField}
            />
            <ErrorMessage name="email" component="div" />
            <div
              style={{
                marginRight: "55%",
                marginBottom: "0px",
                marginTop: "10px",
              }}
            >
              <label>Password:</label>
            </div>
            <Field
              style={{ ...fieldStyle, marginTop: "-10px" }}
              placeholder="password"
              type="password"
              name="password1"
              as={TextField}
            />
            <div
              style={{
                marginRight: "36%",
                marginBottom: "0px",
                marginTop: "10px",
              }}
            >
              <label>Confirm password</label>
            </div>
            <Field
              style={{ ...fieldStyle, marginTop: "-10px" }}
              placeholder="confirm password"
              type="password"
              name="password2"
              as={TextField}
            />
            <ErrorMessage name="password1" component="pre" />
            <p>{submitError}</p>

            <div>
              <Button
                style={{ marginTop: "15px" }}
                type="submit"
                disabled={isSubmitting}
              >
                Register
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
