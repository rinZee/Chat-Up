import Head from "next/head";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import UsernameField from "../components/UsernameField";

export default function Home() {
  // save the socket
  const [socket, setSocket] = useState(null);

  // Whether the username is set.
  const [isUsernameConfirmed, setUsernameConfirmed] = useState(false);

  // State for the username.
  const [username, setUsername] = useState("");

  // State for the form field.
  const [message, setMessage] = useState("");

  // State for message history.
  const [history, setHistory] = useState([
    /*
    {
      username: "Santa Claus",
      message: "Ho ho ho!"
    }
    */
  ]);

  const connectSocket = () => {
    // prime the server first. yes, this is an extra call and is inefficient.
    // but we're using NextJS for convenience, so this is a necessary evil.
    fetch("/api/chat");
    // after making sure that socket server is primed, connect to it.

    if (!socket) {
      const newSocket = io();

      // Confirms connection
      newSocket.on("connect", () => {
        console.log("Chat app connected");
      });

      // handles message
      newSocket.on("message", (msg) => {
        setHistory((history) => [...history, msg]);
      });

      // Logs when server disconnects
      newSocket.on("disconnect", () => {
        console.warn("WARNING: chat app disconnected");
      });

      setSocket(() => newSocket);
    }
  };

  // The websocket code
  useEffect(() => {
    connectSocket();
  }, []);

  // this method submits the form and sends the message to the server.
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!socket) {
      alert("Chatroom not connected yet. Try again in a little bit.");
      return;
    }

    // prevent empty submissions
    if (!message || !isUsernameConfirmed) {
      return;
    }

    // submit and blank-out the field.
    socket.emit("message-submitted", { message, username });
    setMessage("");
  };

  return (
    <div>
      {/* This sets the page's title and favicon */}
      <Head>
        <title>ChatUp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* The username area */}
      <UsernameField
        value={username}
        onChange={(value) => setUsername(value)}
        onSubmit={() => setUsernameConfirmed(true)}
        completed={isUsernameConfirmed}
      />

      {/* Form submission */}
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Type your message:
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                username ? "Enter your message..." : "Set username..."
              }
              disabled={!isUsernameConfirmed}
            />
          </label>
          <input type="submit" value="Submit" disabled={!isUsernameConfirmed} />
        </form>
      </div>

      {/* The list of messages */}
      <div>
        {history.map(({ username, message }, i) => (
          <div key={i}>
            <b>{username}</b>: {message}
          </div>
        ))}
      </div>
    </div>
  );
}

