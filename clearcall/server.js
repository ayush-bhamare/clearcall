// ClearCall server: serves the page and relays call signalling + text between two people in a room.
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    room = String(room || '').slice(0, 40);
    if (!room) return;
    const members = io.sockets.adapter.rooms.get(room);
    if (members && members.size >= 2) return socket.emit('full');
    socket.join(room);
    socket.room = room;
    const size = io.sockets.adapter.rooms.get(room).size;
    // The second person to join starts the call.
    socket.emit('joined', { initiator: size === 2 });
  });

  // WebRTC offer/answer/ICE messages, passed straight to the other person.
  socket.on('signal', (data) => socket.room && socket.to(socket.room).emit('signal', data));

  // Text and spell-out messages sent during the call.
  socket.on('text', (m) => {
    if (!socket.room || !m || typeof m.text !== 'string') return;
    socket.to(socket.room).emit('text', {
      id: String(m.id).slice(0, 40),
      kind: m.kind === 'spell' ? 'spell' : 'chat',
      text: m.text.slice(0, 300),
    });
  });

  // "Got it" confirmation for a spelled-out message.
  socket.on('ack', (id) => socket.room && socket.to(socket.room).emit('ack', String(id).slice(0, 40)));

  socket.on('disconnect', () => socket.room && socket.to(socket.room).emit('peer-left'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`ClearCall running at http://localhost:${PORT}`));
