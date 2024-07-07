import React, { useState } from "react";
import axios from "axios";
import Message from "./Message";
import SummaryOptions from "./SummaryOptions";
import "../style/Chatbox.css";
import "../style/Message.css";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome! Please upload a file to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [summaryOptions, setSummaryOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const sendMessage = async () => {
    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const response = await axios.post("http://localhost:8000/chat/", {
      history: updatedMessages,
      document_text: documentText,
    });

    const botMessage = { role: "assistant", content: response.data.answer };
    setMessages([...updatedMessages, botMessage]);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDocumentText(response.data.text);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "Please select the summary length (short, medium, long) and the level of detail.",
        },
      ]);
    } catch (error) {
      console.error("Error during file upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSummaryOptions = async (length, detail) => {
    setSummaryOptions({ length, detail });
    setLoading(true);

    try {
      const summaryResponse = await axios.post(
        "http://localhost:8000/summarize/",
        {
          text: documentText,
          length: length,
          detail: detail,
        }
      );

      const botMessage = {
        role: "assistant",
        content: summaryResponse.data.summary,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error during summarization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="message-list">
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
        {loading && (
          <div className="Bot assistant typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
      <div className="file-upload-container">
        {!documentText && (
          <div className="file-upload">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? (
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}
        {documentText && !summaryOptions && (
          <SummaryOptions onSubmit={handleSummaryOptions} />
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
