import React, { useState, useEffect, useRef } from "react";
import "../css/messages.css";
import axios from "axios";
import { v4 as uuid } from "uuid";

import { NameTag, Message, MessageInput } from "./msgComponents";

const Messages = (props) => {
  const [currMessage, setCurrMessage] = useState("");

  const sendMessage = () => {
    const data = {
      message: currMessage,
      recipient: senderRef.current.username,
    };
    const headers = {
      Authorization: props.token,
      "Content-Type": "application/json",
    };
    axios
      .post("/api/messages", data, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const [users, setUsers] = useState([]);
  const searchNames = (name) => {
    if (!name) {
      getChatList();
    } else {
      const headers = { Authorization: props.token };
      axios
        .get(`/api/users/search/${name}`, { headers })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const senderName = localStorage.getItem("senderName");
  const senderImage = localStorage.getItem("senderImage");

  const [currSender, setCurrSender] = useState(
    senderName ? { username: senderName, imageUrl: senderImage } : {}
  );

  const senderRef = useRef({});
  senderRef.current = currSender;

  useEffect(() => {
    localStorage.setItem("senderName", currSender.username);
    localStorage.setItem("senderImage", currSender.imageUrl);
  }, [currSender]);

  const getChatList = () => {
    const headers = { Authorization: props.token };
    axios
      .get("/api/messages/names", { headers })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    getChatList();
  }, []);

  const [allMessages, setAllMessages] = useState([]);

  const allMessageRef = useRef([]);
  allMessageRef.current = allMessages;

  const getMessages = (username) => {
    const headers = {
      Authorization: props.token,
    };
    axios
      .get(`/api/messages/${username}`, { headers })
      .then((response) => {
        const messages = response.data;
        if (allMessages.length != 0) {
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

  useEffect(() => {
    const checkForMessages = setInterval(() => {
      if (senderRef.current.username) {
        getMessages(senderRef.current.username);
      }
      getChatList();
    }, 500);
    return () => {
      clearInterval(checkForMessages);
    };
  }, []);

  useEffect(() => {
    console.log("mount");
    return () => {
      console.log("unount");
    };
  }, []);

  const messageConatinerRef = useRef(null);

  useEffect(() => {
    messageConatinerRef.current.scrollTop =
      messageConatinerRef.current.scrollHeight;
  }, [allMessages]);

  return (
    <div className="container" style={{ minWidth: "1600px" }}>
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <form>
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
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    {currSender.imageUrl ? (
                      <img
                        src={senderRef.current.imageUrl}
                        className="rounded-circle user_img"
                      />
                    ) : null}
                    {/* <span className="online_icon"></span> */}
                  </div>
                  <div className="user_info">
                    {currSender.username ? (
                      <span>Chat with {senderRef.current.username}</span>
                    ) : null}
                  </div>
                </div>
                <span id="action_menu_btn">
                  <i className="fas fa-ellipsis-v"></i>
                </span>
                <div className="action_menu">
                  <ul>
                    <li>
                      <button id="li-button">
                        <i className="fas fa-user-circle"></i> View profile{" "}
                      </button>
                    </li>
                    <li>
                      <button id="li-button">
                        <i className="fas fa-users"></i> Add to close friends
                      </button>
                    </li>
                    <li>
                      <button id="li-button">
                        <i className="fas fa-plus"></i> Add to group
                      </button>
                    </li>
                    <li>
                      <button id="li-button">
                        <i className="fas fa-ban"></i> Block
                      </button>
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
