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
            <Field
              style={fieldStyle}
              placeholder="username"
              type="text"
              name="username"
              as={TextField}
            />
            <Field
              style={fieldStyle}
              placeholder="email"
              type="email"
              name="email"
              as={TextField}
            />
            <ErrorMessage name="email" component="div" />
            <Field
              style={fieldStyle}
              placeholder="password"
              type="password"
              name="password1"
              as={TextField}
            />
            <Field
              style={fieldStyle}
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
