import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const Home = () => {
  document.title = "Home";

  return (
    <div>
      <h1>HomePage</h1>
    </div>
  );
};

export default Home;
