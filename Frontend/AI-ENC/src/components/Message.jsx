import React from "react";
import "../style/Message.css";

const Message = ({ role, content }) => {
  return <div className={role === "assistant" ? "Bot" : "You"}>{content}</div>;
};

export default Message;
