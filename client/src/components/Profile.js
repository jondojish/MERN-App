import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Button } from "@material-ui/core";

const passIsValid = (pass1, pass2) => {
  const errors = [];
  if (pass1 != pass2) errors.push("Passwords dont match");
  if (pass1.length < 8) errors.push("Password must be at least 8 characters");
  if (!/\d/.test(pass1)) errors.push("Password must contain at least on digit");
  if (errors.length > 0) return { errors };
  return true;
};

const Profile = (props) => {
  document.title = "Profile";

  // Currently entered image
  const [uploadImage, setImage] = useState(null);

  const refreshImage = () => {
    const headers = { Authorization: props.token };
    axios
      .get("/api/users", { headers })
      .then((response) => {
        props.setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [submitErrors, setSubmitErrors] = useState([]);

  // Change password of client
  const changePassword = ({ newPass1, newPass2, oldPass }) => {
    const passValid = passIsValid(newPass1, newPass2);
    if (passValid !== true) {
      setSubmitErrors((prevErr) => [...prevErr, ...passValid.errors]);
      if (!oldPass) {
        setSubmitErrors((prevErr) => [...prevErr, "must enter old password"]);
      }
    } else {
      const headers = { Authorization: props.token };
      const data = { oldPassEntered: oldPass, newPass: newPass1 };

      axios
        .post("/api/auth/changePassword", data, { headers })
        .then((response) => {
          setSubmitErrors((prevErr) => [...prevErr, response.data.msg]);
        })
        .catch((err) => {
          setSubmitErrors((prevErr) => [...prevErr, err.response.data.msg]);
        });
    }
  };

  // Changes profile picture of client
  const changeProfilePic = (event) => {
    const formData = new FormData();
    formData.append("file", uploadImage, uploadImage.filename);
    const headers = {
      Authorization: props.token,
      "Content-Type": "multipart/form-data",
    };
    axios
      .post("/api/profile/image", formData, { headers })
      .then((response) => {
        refreshImage();
        setSubmitErrors((prevErrors) => [
          ...prevErrors,
          "profile pictue changed",
        ]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
      className="form-signin"
    >
      <Formik
        initialValues={{
          oldPass: "",
          newPass1: "",
          newPass2: "",
        }}
        validate={(values) => {
          const errors = {};
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitErrors([]);
          setImage(null);
          setSubmitting(true);
          if (
            uploadImage &&
            (values.newPass1 || values.newPass2 || values.oldPass)
          ) {
            changeProfilePic();
            changePassword(values);
          } else if (uploadImage) {
            changeProfilePic();
          } else if (values.newPass1 || values.newPass2 || values.oldPass) {
            changePassword(values);
          } else {
            setSubmitErrors((prevErrors) => [
              ...prevErrors,
              "select an image or change password",
            ]);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <img
              src={props.imageUrl}
              className="rounded-circle"
              style={{ width: "150px" }}
              alt="coat"
            />
            <div>
              {props.followers ? (
                <pre>
                  {props.followers.length} followers{"       "}
                  {props.following.length} following
                </pre>
              ) : null}
            </div>
            <div style={{ lineHeight: "8px" }}>
              <p>{props.username}</p>
              <p>Email: {props.email}</p>
            </div>
            <p>Change Password:</p>
            <Field
              placeholder="old password"
              type="password"
              name="oldPass"
              as={TextField}
            />
            <Field
              placeholder="new password"
              type="password"
              name="newPass1"
              as={TextField}
            />
            <ErrorMessage name="email" component="div" />

            <Field
              placeholder="confirm password"
              type="password"
              name="newPass2"
              as={TextField}
            />
            <ErrorMessage name="password1" component="div" />
            <br />
            <p>Change profile pic</p>
            <input
              style={{ marginBottom: "10px" }}
              type="file"
              name="file"
              accept="image/x-png,image/jpeg"
              onChange={(event) => {
                setImage(event.target.files[0]);
              }}
            />

            {submitErrors.map((err) => (
              <p style={{ lineHeight: "15px" }} key={uuid()}>
                {err}
              </p>
            ))}

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

export default Profile;
