import React, { useState, useEffect, useRef } from "react";
import "../css/messages.css";
import axios from "axios";
import { v4 as uuid } from "uuid";

import { NameTag, Message, MessageInput } from "./msgComponents";

const Messages = (props) => {
  document.title = "Messaging";
  // frequently used hearder containing Auth
  const headers = { Authorization: props.token };

  // Sender Specific

  // sender is stored in local storage
  const senderName = localStorage.getItem("senderName");
  const senderImage = localStorage.getItem("senderImage");

  // Current sender is retrieved from local storage if exists
  const [currSender, setCurrSender] = useState(
    senderName ? { username: senderName, imageUrl: senderImage } : {}
  );

  // useRef to prevent re-rendering when accessing sender IDK why
  const senderRef = useRef({});
  senderRef.current = currSender;

  // Stores sender in local storage when sender is changed
  useEffect(() => {
    if (senderRef.current.username) {
      localStorage.setItem("senderName", currSender.username);
      localStorage.setItem("senderImage", currSender.imageUrl);
    }
  }, [currSender]);

  // Chat List

  // Gets Recently messaged users
  const getChatList = () => {
    axios
      .get("/api/messages/names", { headers })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // Gets Recently messaged users on reload
  useEffect(() => {
    getChatList();
  }, []);

  // State contains users to be mapped in chat list
  const [users, setUsers] = useState([]);

  // Gets users where name searched is in username
  const searchNames = (partialName) => {
    // Gets recently messaged users if empty
    if (!partialName) {
      getChatList();
    } else {
      axios
        .get(`/api/users/search/${partialName}`, { headers })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  // Sending Messages

  // currently inputed message
  const [currMessage, setCurrMessage] = useState("");

  // Post request to send a message
  const sendMessage = () => {
    const data = {
      message: currMessage,
      recipient: senderRef.current.username,
    };
    axios
      .post("/api/messages", data, { headers })
      .then((response) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };

  // Getting Messages

  // useRef to prevent re-rendering when accessing messages IDK why
  const [allMessages, setAllMessages] = useState([]);
  const allMessageRef = useRef([]);
  allMessageRef.current = allMessages;

  // Gets all messages from requested user
  const getMessages = (username) => {
    axios
      .get(`/api/messages/${username}`, { headers })
      .then((response) => {
        const messages = response.data;
        if (messages.length != 0 && allMessageRef.current.length != 0) {
          if (
            messages[messages.length - 1]["_id"] !=
            allMessageRef.current[allMessageRef.current.length - 1]["_id"]
          ) {
            setAllMessages(messages);
          }
        } else {
          setAllMessages(messages);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // checks for new messages every n milliseconds
  useEffect(() => {
    const checkForMessages = setInterval(() => {
      if (senderRef.current.username) {
        getMessages(senderRef.current.username);
      }
    }, 500);
    return () => {
      clearInterval(checkForMessages);
    };
  }, []);

  // Action Menu

  // scrolls to bottom when a new message is sent/recieved
  const messageConatinerRef = useRef(null);
  useEffect(() => {
    messageConatinerRef.current.scrollTop =
      messageConatinerRef.current.scrollHeight;
  }, [allMessages]);

  const actionMenu = useRef(null);

  // Following

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
    checkIfFollowing(senderRef.current.username).then((following) => {
      setIsFollowing(following);
    });
  }, [senderRef.current, []]);

  // follows a requested user
  const follow = async (username) => {
    console.log(headers);
    const data = { username };
    return axios
      .post("/api/profile/follow", data, { headers })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err));
  };

  // unfollows a requested user
  const unFollow = async (username) => {
    const data = { username };
    return axios
      .post("/api/profile/unFollow", data, { headers })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container" style={{ minWidth: "1600px" }}>
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <form>
                  {/* User search  */}
                  <div className="input-group">
                    <input
                      name="name"
                      placeholder="Search..."
                      onChange={(event) => {
                        searchNames(event.target.value);
                      }}
                      className="form-control search"
                    />
                    <div className="input-group-prepend">
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          padding: "0px 0px",
                        }}
                      >
                        <span
                          style={{ padding: ".69rem .75rem" }}
                          className=" input-group-text search_btn"
                        >
                          <i className="fas fa-search"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* contact list */}
              <div className="card-body contacts_body">
                <ul className="contacts">
                  {users.map((user) => (
                    <NameTag
                      key={uuid()}
                      username={user.username}
                      imageUrl={user.imageUrl}
                      getMessages={getMessages}
                      setCurrSender={setCurrSender}
                    />
                  ))}
                </ul>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                {/* Messages header */}
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    {senderRef.current.imageUrl ? (
                      <img
                        src={senderRef.current.imageUrl}
                        className="rounded-circle user_img"
                      />
                    ) : null}
                    {/* <span className="online_icon"></span> */}
                  </div>
                  <div className="user_info">
                    {senderRef.current.username ? (
                      <span>Chat with {senderRef.current.username}</span>
                    ) : null}
                  </div>
                </div>
                {/* User options */}
                <span
                  onClick={() => {
                    if (actionMenu.current.style.display == "none") {
                      actionMenu.current.style.display = "flex";
                    } else {
                      actionMenu.current.style.display = "none";
                    }
                  }}
                  id="action_menu_btn"
                >
                  <i className="fas fa-ellipsis-v"></i>
                </span>
                <div
                  style={{ display: "none" }}
                  ref={actionMenu}
                  className="action_menu"
                >
                  <ul>
                    <li
                      onClick={() => {
                        props.history.push(
                          `/profile/${senderRef.current.username}`
                        );
                      }}
                    >
                      <i className="fas fa-user-circle"></i> View profile{" "}
                    </li>
                    <li
                      onClick={async (event) => {
                        if (!isFollowing) {
                          await follow(senderRef.current.username);
                          setIsFollowing(true);
                        } else {
                          await unFollow(senderRef.current.username);
                          setIsFollowing(false);
                        }
                      }}
                    >
                      <i className="fas fa-users"></i>
                      {isFollowing ? "Following" : "Follow"}
                    </li>
                    <li>
                      <i className="fas fa-plus"></i> Add to group
                    </li>
                    <li>
                      <i className="fas fa-ban"></i> Block
                    </li>
                  </ul>
                </div>
              </div>

              <div
                ref={messageConatinerRef}
                className="card-body msg_card_body"
              >
                {allMessages.map((message) => (
                  <Message
                    key={uuid()}
                    imageUrl={
                      message.recipient == props.username
                        ? senderRef.current.imageUrl
                        : props.imageUrl
                    }
                    messageText={message.message}
                    recieved={
                      message.recipient == props.username ? true : false
                    }
                  />
                ))}
              </div>
              <MessageInput
                sendMessage={sendMessage}
                setCurrMessage={setCurrMessage}
                getMessages={getMessages}
                currSender={currSender}
                currMessage={currMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
