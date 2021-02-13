import React from "react";
import logo from "../images/logo.png";

const MyNav = (props) => {
  return (
    <div className="my_nav">
      <nav
        id="my_nav"
        className="navbar fixed-top navbar-expand-lg navbar-dark"
      >
        <a href="/">
          <img src={logo} alt="logo" width="60" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span
            style={{ stroke: "black" }}
            className="navbar-toggler-icon"
          ></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <a
              style={{ color: "white" }}
              className="nav-item nav-link"
              href="/"
            >
              Home
            </a>
            <a
              style={{ color: "white" }}
              className="nav-item nav-link"
              href="/login"
            >
              {props.token ? "Logout" : "Login"}
            </a>
            <a
              style={{ color: "white" }}
              className="nav-item nav-link"
              href="/profile"
            >
              Profile
            </a>
            <a
              style={{ color: "white" }}
              className="nav-item nav-link"
              href="/chat"
            >
              Chat
            </a>
            <a
              style={{ color: "white" }}
              className="nav-item nav-link"
              href="/messages"
            >
              Messages
            </a>
          </ul>
          <form className="form-inline">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-info my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
};

export default MyNav;
