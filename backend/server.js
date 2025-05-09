const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoute = require('./routes/authRoute');
const itemRoute = require('./routes/itemRoute');
const userRoute = require('./routes/userRoute');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoute);
app.use('/items', itemRoute);
app.use('/users', userRoute);
app.use('/messages', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'vue-frontend-production-52be.up.railway.app',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Nova konekcija:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} ušao u sobu ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    console.log('Primljeno:', data);
    const { roomId, message } = data;

    if (!roomId || typeof roomId !== 'string') {
      console.error('Nevažeći roomId:', roomId);
      return;
    }

    io.to(roomId).emit('newMessage', message);
    console.log(`Poruka poslana u sobu ${roomId}:`, message);
  });

  socket.on('disconnect', () => {
    console.log('Socket odspojen:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server with Socket.IO listening on port ${PORT}`);
});
