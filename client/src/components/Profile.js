import React, { useState } from "react";
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

const Profile = (props) => {
  const [uploadImage, setImage] = useState(null);
  const [errors, setErrors] = useState([]);

  const refreshImage = () => {
    const headers = { Authorization: props.token };
    axios
      .get("/api/users", { headers })
      .then((response) => {
        console.log(response.data);
        props.setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [oldPass, setOldPass] = useState("");
  const [newPass1, setNewPass1] = useState("");
  const [newPass2, setNewPass2] = useState("");

  const changePassword = () => {
    const passValid = passIsValid(newPass1, newPass2);
    if (passValid !== true) {
      setErrors((prevErr) => [...prevErr, ...passValid.errors]);
      if (!oldPass) {
        setErrors((prevErr) => [...prevErr, "must enter old password"]);
      }
    } else {
      const headers = { Authorization: props.token };
      const data = { oldPassEntered: oldPass, newPass: newPass1 };

      axios
        .post("/api/auth/changePassword", data, { headers })
        .then((response) => {
          console.log("jjk");

          console.log(response);
          setErrors((prevErr) => [...prevErr, response.data.msg]);
        })
        .catch((err) => {
          console.log("jj");

          setErrors((prevErr) => [...prevErr, err.response.data.msg]);
        });
    }
  };

  const changeProfilePic = (event) => {
    if (uploadImage != null) {
      const formData = new FormData();
      formData.append("file", uploadImage, uploadImage.filename);
      const headers = {
        Authorization: props.token,
        "Content-Type": "multipart/form-data",
      };
      axios
        .post("/api/profile/image", formData, { headers })
        .then((response) => {
          console.log(response.data);
          refreshImage();
          setErrors((prevErrors) => [...prevErrors, "profile pictue changed"]);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      setErrors((prevErrors) => [...prevErrors, "You need to select a file"]);
    }
  };

  const handleSubmit = () => {
    if (uploadImage && (newPass1 || newPass2 || oldPass)) {
      changeProfilePic();
      changePassword();
    } else if (uploadImage) {
      changeProfilePic();
    } else if (newPass1 || newPass2 || oldPass) {
      changePassword();
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        "select an image or change password",
      ]);
    }
  };

  let errorTags = [];

  errors.map((err) => {
    errorTags.push(
      <p style={{ lineHeight: "5px" }} key={uuid()}>
        {err}
      </p>
    );
  });

  return (
    <div className="container">
      <h1 id="header_text">Logged in as {props.username} </h1>
      <div style={{ minWidth: "40%" }} className="form_wrapper">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setErrors([]);
            handleSubmit();
          }}
          encType="multipart/form-data"
        >
          <img
            src={props.imageUrl}
            className="rounded-circle"
            style={{ width: "150px" }}
            alt="coat"
          />
          <p>Email: {props.email}</p>
          <br />
          <p>Change Password:</p>
          <br />
          <input
            style={{ minWidth: "70%", borderRadius: "10px" }}
            placeholder="old password"
            type="password"
            name="oldPass"
            onChange={(event) => {
              setOldPass(event.target.value);
            }}
          />
          <br />
          <br />
          <input
            style={{ minWidth: "70%", borderRadius: "10px" }}
            placeholder="new password"
            type="password"
            name="newPass1"
            onChange={(event) => {
              setNewPass1(event.target.value);
            }}
          />
          <br />
          <br />
          <input
            style={{ minWidth: "70%", borderRadius: "10px" }}
            placeholder="Confirm Password"
            type="password"
            name="newPass2"
            onChange={(event) => {
              setNewPass2(event.target.value);
            }}
          />
          <br />
          <br />
          <p>Change Profile Picture:</p>

          <input
            type="file"
            name="file"
            accept="image/x-png,image/jpeg"
            onChange={(event) => {
              setImage(event.target.files[0]);
              console.log(event.target.files[0]);
            }}
          />

          <div
            className="p_error"
            style={{ lineHeight: "2px", paddingTop: "10px" }}
          ></div>

          {errorTags}
          <button className="btn btn-slg btn-primary btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
