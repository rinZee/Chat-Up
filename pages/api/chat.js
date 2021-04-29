import { Server } from "socket.io";

  const ioHandler = (req, res) => {
    // if the socket server hasn't started yet, start it up.
    if (!res.socket.server.io) {
      console.log("First use, starting socket.io");
  
      // create the websocket server
      const io = new Server(res.socket.server);
  
      io.on("connection", (socket) => {

        //when a new user logs in
        socket.on('login', function(data){
          console.log('a user ' + data.userId + ' connected');
                });
                // when a message is submitted, broadcast it.
        socket.on("message-submitted", (msg) => {
          // echo the message back to the user
        socket.emit("message", msg);
          // broadcast the message to everyone else
        socket.broadcast.emit("message", msg);
        });
      });
  
      // make the socket available externally.
      res.socket.server.io = io;
    } else {
      // don't do anything if the server was already started.
      console.log("Server already started");
    }
  
    // send back an empty 200
    res.end();
  };
  
  export default ioHandler;