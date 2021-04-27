// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req,res) => {
  res.send('<h1>hello world</h1>');
});

server.listen(3000, () => {
  console.log('listening on port *:3000');
});

