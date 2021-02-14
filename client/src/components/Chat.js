import React from "react";

const Chat = () => {
  return (
    <div classNameName="container" style={{ minWidth: "1300px" }}>
      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              {/* <!-- messages --> */}
              <div id="scroll_down" className="card-body msg_card_body">
                {/* {% if all_msg %}
                        {% for msg in all_msg %}
                        {% with sender=senders|index:forloop.counter0 %}
                        {% if sender.username == user.username %} */}
                <div className="d-flex justify-content-start mb-4">
                  <div className="img_cont_msg">
                    <img
                      src="{{user.profile.image.url}}"
                      className="rounded-circle user_img_msg"
                    />
                  </div>
                  <div className="msg_cotainer">
                    {/* {{msg|linebreaksbr}} */}
                    <p id="msg">Hello How is life</p>
                    <span className="msg_time">user.username</span>
                  </div>
                </div>
                {/* {% else %} */}
                <div className="d-flex justify-content-end mb-4">
                  <div className="msg_cotainer_send">
                    {/* {{msg|linebreaksbr}} */}
                    <p id="msg">Hello How is life</p>

                    <span className="msg_time_send">sender.username</span>
                  </div>
                  <div className="img_cont_msg">
                    <img
                      src="{{sender.profile.image.url}}"
                      className="rounded-circle user_img_msg"
                    />
                  </div>
                </div>
                {/* {% endif %}
                        {% endwith %}
                        {% endfor %}
                        {% endif %} */}
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

export default Chat;

{
  /* 
let myDiv = document.getElementById("scroll_down");
myDiv.scrollTop = myDiv.scrollHeight;

$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    }); */
}
