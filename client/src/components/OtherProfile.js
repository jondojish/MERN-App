import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

const OtherProfile = (props) => {
  // get username from params
  const paramUsername = props.match.params.username;

  const headers = { Authorization: props.token };

  if (paramUsername == props.username) {
    props.history.push("/profile");
  }

  const [currProfile, setCurrProfile] = useState({
    followers: [],
    following: [],
  });
  const getUserInfo = (username) => {
    return axios
      .get(`/api/users/${username}`)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        // User doesnt exist so redirect or clients profile
        props.history.push("/profile");
        console.log(err.response);
      });
  };

  useEffect(() => {
    getUserInfo(paramUsername).then((response) => {
      setCurrProfile(response.data);
    });
  }, []);

  // follows a requested user
  const follow = async (username) => {
    const data = { username };
    return axios
      .post("/api/profile/follow", data, { headers })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err.response));
  };

  // follows a requested user
  const unFollow = async (username) => {
    const data = { username };
    return axios
      .post("/api/profile/unFollow", data, { headers })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err.response));
  };

  // Return weather or not the client is following the current sender
  const checkIfFollowing = (username) => {
    return axios
      .get(`/api/users/${username}`)
      .then((response) => {
        return response.data.followers.includes(props.username);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // checks if following after eery sender change
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    checkIfFollowing(currProfile.username).then((following) => {
      setIsFollowing(following);
    });
  });

  return (
    <div
      style={{
        minWidth: "27vw",
        minHeight: "40vh",
        fontSize: "20px",
        textAlign: "center",
      }}
      className="form-signin"
    >
      <img
        src={currProfile.imageUrl}
        className="rounded-circle"
        style={{ width: "100px" }}
        alt="coat"
      />
      <div>
        <div>{currProfile.username}</div>
        <pre>
          {currProfile.followers.length} followers{"       "}
          {currProfile.following.length} following
        </pre>
        <button
          style={{ marginRight: "90px" }}
          onClick={(event) => {
            // Sender is retrieved from local storage so when redirected
            // to messages currProfile is Sender
            localStorage.setItem("senderName", currProfile.username);
            localStorage.setItem("senderImage", currProfile.imageUrl);
            props.history.push("/messaging");
          }}
          id="follow-button"
        >
          Message
        </button>
        <button
          onClick={(event) => {
            if (isFollowing) {
              // manualy change innerHTML as well for instant change
              event.target.innerHTML = "+ Follow";
              unFollow(currProfile.username).then((res) => {
                setIsFollowing(false);
              });
            } else {
              // manualy change innerHTML as well for instant change
              event.target.innerHTML = "Following";
              follow(currProfile.username).then((res) => {
                setIsFollowing(true);
              });
            }
          }}
          id="follow-button"
        >
          {isFollowing ? "Following" : "+ Follow"}
        </button>
      </div>{" "}
    </div>
  );
};

export default OtherProfile;
