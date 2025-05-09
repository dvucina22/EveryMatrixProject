import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const deref = (v) => (typeof v === 'object' && v.value ? v.value : v);

const joinRoom = (roomId) => {
  const room = deref(roomId);
  console.log('Join room:', room);
  socket.emit('joinRoom', room);
};

const sendMessage = (roomId, message) => {
  const room = deref(roomId);
  console.log('Send to room:', room, message);
  socket.emit('sendMessage', { roomId: room, message });
};

const onNewMessage = (callback) => {
  socket.on('newMessage', (msg) => {
    console.log('Primljena nova poruka:', msg);
    callback(msg);
  });
};

const disconnect = () => {
  socket.disconnect();
};

export default {
  joinRoom,
  sendMessage,
  onNewMessage,
  disconnect,
};
