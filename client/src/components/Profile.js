import React, { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

const Profile = (props) => {
  const [uploadImage, setImage] = useState(null);
  const [errors, setErrors] = useState([]);

  const refreshImage = () => {
    const headers = { Authorization: props.token };
    axios
      .get("/api/users", { headers: headers })
      .then((currUser) => {
        console.log(currUser.data);
        props.setUser(currUser.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (event) => {
    if (uploadImage != null) {
      const formData = new FormData();
      formData.append("file", uploadImage, uploadImage.filename);
      const headers = {
        Authorization: props.token,
        "Content-Type": "multipart/form-data",
      };
      axios
        .post("/api/image", formData, { headers })
        .then((response) => {
          console.log(props.token);
          console.log(response.data);
          refreshImage();
          setErrors((prevErrors) => [...prevErrors, "profile pictue changed"]);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      console.log("You need to select a file");
    }
  };

  let errorTags = [];

  errors.map((err) => {
    errorTags.push(<p key={uuid()}>{err}</p>);
  });

  return (
    <div className="container">
      <h1 id="header_text">Logged in as {props.username} </h1>
      <div style={{ minWidth: "40%" }} className="form_wrapper">
        <form
          onSubmit={(event) => {
            setErrors([]);
            event.preventDefault();
            handleSubmit(event);
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
            name="password_old"
          />
          <br />
          <br />
          <input
            style={{ minWidth: "70%", borderRadius: "10px" }}
            placeholder="new password"
            type="password"
            name="password1"
          />
          <br />
          <br />
          <input
            style={{ minWidth: "70%", borderRadius: "10px" }}
            placeholder="Confirm Password"
            type="password"
            name="password2"
          />
          <br />
          <br />
          <p>Change Profile Picture:</p>
          {/* {% comment %}
      {{profile_form.image}}
      {% endcomment %} */}

          <input
            type="file"
            name="file"
            accept="image/x-png,image/jpeg"
            onChange={(event) => {
              setImage(event.target.files[0]);
              console.log(event.target.files[0]);
            }}
          />
          {/* {% if messages %} */}
          {/* {% for msg in messages %} */}
          {/* <p>{{ msg }}</p> */}
          {/* {% endfor %} */}
          {/* {% endif %} */}
          {/* <!-- <br></br> --> */}
          <div
            className="p_error"
            style={{ lineHeight: "2px", paddingTop: "10px" }}
          >
            {/* {% if p_form.errors %}
        {% for key, value in p_form.errors.items %}
        {% for error in value %}
        {% if error != 'This field is required.' %}
        <p>{{ error|striptags }}</p>
        {% endif%}
        {% endfor %}
        {% endfor %}
        {% endif %} */}
          </div>

          {/* {% if profile_form.errors %} */}
          {/* {% for key, value in profile_form.errors.items %}
      {% for error in value %}
      <p>{{ error|striptags }}</p>
      {% endfor %}
      {% endfor %}
      {% endif %} */}
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
