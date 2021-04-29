import Head from "next/head";
import {useState, useEffect} from 'react';
import {io} from 'socket.io-client';

export default function Home() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
const [history, setHistory] = useState([]);
  const submitMessage = (e) => {
    e.preventDefault();
    if(!socket) {
      alert('chatroom not connected');
      return;
    }
    socket.emit('submit', message);
    setMessage(''); 
   }

useEffect(() => {
  fetch('./api/chat').finally(() => {

    const newSocket = io();
    // confirm connection
    newSocket.on('connect', () => {
      console.log('chat app connected');
          });
 
// logs when server disconnects
  newSocket.on('disconnect', () => {
    console.log('chat app disconnected');
        });

        newSocket.on('message', (msg) => {
setHistory((history) => [...history, msg]);
        })
        setSocket(() => newSocket);
      });
}, [])

  return (
    <div>
      {/* This sets the page's title and favicon */}
      <Head>
        <title>ChatUp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {history.map(msg => {
        <h1>{msg}</h1>
      })}
      <form onSubmit={submitMessage}>
        <input placeholder='type your message' value={message} onChange={(e) => setMessage(e.target.value)}></input>
        <button>Submit</button>
      </form>
    </div>
  );
}

