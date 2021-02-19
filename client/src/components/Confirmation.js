import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";

const Confirmation = (props) => {
  const [submitError, setSubmitError] = useState(null);

  const register = ({ username, email, password }) => {
    const data = { username, email, password };
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

  return (
    <div>
      <div
        style={{
          textAlign: "center",
        }}
        className="form-signin"
      >
        <h1 id="header_text" className="h3 mb-3 font-weight-normal">
          Confirmation
        </h1>
        <p>Enter the code sent to</p>
        <p>{props.tempUser.email}</p>
        <Formik
          initialValues={{
            code: "",
          }}
          validate={(values) => {
            var errors = {};
            if (!values.code) {
              errors.code = "Required";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            if (values.code == props.confirmationCode) {
              register(props.tempUser).then((err) => {
                if (err) {
                  setSubmitError(err);
                } else {
                  props.history.push("/profile");
                }
              });
            } else {
              setSubmitError("Incorrect Code");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                placeholder="code"
                type="text"
                name="code"
                as={TextField}
              />
              <ErrorMessage name="code" component="div" />
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
    </div>
  );
};

export default Confirmation;
