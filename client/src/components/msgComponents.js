import React from "react";
import { v4 as uuid } from "uuid";

export const NameTag = (props) => {
  const username = props.username;
  const imageUrl = props.imageUrl;
  return (
    <li key={uuid()} className="active">
      <button
        value={username}
        name="senderButton"
        onClick={(event) => {
          props.setCurrSender({
            username,
            imageUrl,
          });
          props.getMessages(username);
        }}
        id="sender"
      >
        <div className="d-flex bd-highlight">
          <div className="img_cont">
            <img src={imageUrl} className="rounded-circle user_img" />
          </div>
          <div className="user_info">
            <span>{username}</span>
          </div>
        </div>
      </button>
    </li>
  );
};

export const Message = (props) => {
  const messageText = props.messageText;
  const imageUrl = props.imageUrl;
  const recieved = props.recieved;
  if (recieved) {
    return (
      <div className="d-flex justify-content-start mb-4">
        <div className="img_cont_msg">
          <img src={imageUrl} className="rounded-circle user_img_msg" />
        </div>
        <div className="msg_cotainer">
          <p id="msg">{messageText}</p>
          <span className="msg_time"></span>
        </div>
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-end mb-4">
      <div className="msg_cotainer_send">
        <p id="msg">{messageText}</p>
        <span className="msg_time_send"></span>
      </div>
      <div className="img_cont_msg">
        <img src={imageUrl} className="rounded-circle user_img_msg" />
      </div>
    </div>
  );
};

export const MessageInput = (props) => {
  const handleMessageSubmit = () => {
    props.sendMessage();
    props.setCurrMessage("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleMessageSubmit();
      }}
    >
      <div className="card-footer">
        <div className="input-group">
          <div className="input-group-append">
            <span className="input-group-text attach_btn">
              <i className="fas fa-paperclip"></i>
            </span>
          </div>
          <textarea
            value={props.currMessage}
            className="form-control type_msg"
            placeholder="Type your message..."
            onChange={(event) => {
              props.setCurrMessage(event.target.value);
            }}
          ></textarea>
          <div className="input-group-append">
            <button
              type="submit"
              style={{
                backgroundColor: "transparent",
                border: "none",
                marginRight: "10px",
                textAlign: "center",
                padding: "0px 0px",
              }}
            >
              <span
                style={{ padding: "1.37rem .75rem" }}
                className="input-group-text send_btn"
              >
                <i className="fas fa-location-arrow"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
