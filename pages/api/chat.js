import {Server} from 'socket.io';

const ioHandler = (req, res) => {
    if(!res.socket.server.io) {
        console.log('starting socket.io');

        //create websocket server
        const io = new Server(res.socket.server);

        io.on('connection', (socket) => {
            socket.on('submit', (msg) => {
                socket.emit('message', msg);
            })
        })
        res.socket.server.io = io;
    } else {
        console.log('socket.io is already running')
    }
    res.end();
}

export const config = {
    api: {
      bodyParser: false
    }
  }

  export default ioHandler;