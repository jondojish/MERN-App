import React from "react";
import "../css/messages.css";
import axios from "axios";

const Messages = () => {
  return (
    <div className="container" style={{ minWidth: "1300px" }}>
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <form action="#" method="post">
                  <div className="input-group">
                    <input
                      name="name"
                      type="text"
                      placeholder="Search..."
                      name=""
                      className="form-control search"
                    />
                    <div className="input-group-prepend">
                      <button
                        type="submit"
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
              {/* <!-- contact list --> */}
              <form action="#" method="post">
                <div className="card-body contacts_body">
                  <ui className="contacts">
                    {/* {% for name in chat_names %} */}
                    <li className="active">
                      <button
                        value="{{name.username}}"
                        name="sender_pressed"
                        type="submit"
                        id="sender"
                      >
                        <div className="d-flex bd-highlight">
                          <div className="img_cont">
                            <img
                              src="{{name.profile.image.url}}"
                              className="rounded-circle user_img"
                            />
                            {/* <!-- <span className="online_icon"></span> --> */}
                          </div>
                          <div className="user_info">
                            <span>name.username</span>
                            {/* <!-- <p>name.username is online</p> --> */}
                          </div>
                        </div>
                      </button>
                    </li>
                    {/* {% endfor %} */}
                  </ui>
                </div>
              </form>

              <div className="card-footer"></div>
            </div>
          </div>
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="img_cont">
                    {/* {% if sender %} */}
                    <img
                      src="{{sender.profile.image.url}}"
                      className="rounded-circle user_img"
                    />
                    {/* {% endif %} */}
                    {/* <!-- <span className="online_icon"></span> --> */}
                  </div>
                  <div className="user_info">
                    {/* {% if sender %} */}
                    <span>Chat with sender.username</span>
                    {/* {% endif %} */}
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

              {/* <!-- messages --> */}
              <div id="scroll_down" className="card-body msg_card_body">
                {/* {% if in_or_out %} */}
                {/* {% for choice in in_or_out %} */}
                {/* {% if choice == 'in' %} */}
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg">
                    <img
                      src="{{sender.profile.image.url}}"
                      className="rounded-circle user_img_msg"
                    />
                  </div>
                  <div className="msg_cotainer">
                    {/* {{all_msg|index:forloop.counter0|linebreaksbr}} */}
                    <p id="msg">Hello How is life</p>

                    <span className="msg_time"></span>
                  </div>
                </div>
                {/* {% else %} */}
                <div className="d-flex justify-content-end mb-4">
                  <div className="msg_cotainer_send">
                    {/* {{all_msg|index:forloop.counter0|linebreaksbr}} */}
                    <span className="msg_time_send"></span>
                  </div>
                  <div className="img_cont_msg">
                    <img
                      src="{{user.profile.image.url}}"
                      className="rounded-circle user_img_msg"
                    />
                  </div>
                </div>
                {/* {% endif %} */}
                {/* {% endfor %} */}
                {/* {% endif %} */}
              </div>

              {/* <!-- message input --> */}
              <form action="#" method="post">
                {/* {% csrf_token %} */}
                <div className="card-footer">
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text attach_btn">
                        <i className="fas fa-paperclip"></i>
                      </span>
                    </div>
                    <textarea
                      name="sent_msg"
                      className="form-control type_msg"
                      placeholder="Type your message..."
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
