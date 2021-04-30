import Head from "next/head";
import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import { io } from "socket.io-client";
import UsernameField from '../components/UsernameField';

export default function Home() {
  // users
  const [users, setUsers] = useState({})
  // save the socket
  const [socket, setSocket] = useState(null);

  // check if username is confirmed
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
    // priming the server 
    fetch("/api/chat");

    // after making sure that socket server is primed, connect to it.
    if (!socket) {
      const newSocket = io();

      // Confirms connection
      newSocket.on("connect", () => {
      });

      newSocket.on('login', function(data){
        console.log('a user ' + data.userId + ' connected');
        // saving userId to array with socket ID
        users[socket.id] = data.userId;
      });
      newSocket.on('disconnect', function(){
        console.log('user ' + users[socket.id] + ' disconnected');
        // remove saved socket from users object
        delete users[socket.id];
      });
      // handles message
      newSocket.on("message", (msg) => {
        setHistory((history) => [...history, msg]);
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
    <div className={styles.container}>
      {/* This sets the page's title and favicon */}
      <Head>
        <title>ChatUp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
<div className={styles.leftsection}>
  <h1>{username}</h1>
  <h2>Online</h2>
</div>
      <div className={styles.main}>
      {/* The username area */}
      <UsernameField
      className={styles.userInfo}
        completed={isUsernameConfirmed}
        value={username}
        onChange={(value) => setUsername(value)}
        onSubmit={() => setUsernameConfirmed(true)}
      />

      {/*display messages*/ }
      <div className={styles.messages}>
{history.map(({ username, message }, i) => (
          <div className={styles.msg} key={i}>
            <div className={styles.name}>{username}</div>
            <div className={styles.messageBubble}>{message}</div>
          </div>
        ))}
        </div>

      {/*form submit*/ }
      <form className={styles.submitMsg} onSubmit={handleSubmit}>
        <input placeholder='type your message' value={message} onChange={(e) => setMessage(e.target.value)} disabled={!isUsernameConfirmed}></input>
        <button disabled={!isUsernameConfirmed}>Send</button>
      </form>
</div>

     
      </div>

  );
}

