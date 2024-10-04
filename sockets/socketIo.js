const { Server } = require('socket.io');

function setupSocketIo(server, corsOptions) {
  const io = new Server(server, { cors: corsOptions, connectionStateRecovery: {} });

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ groupId, roomId }) => {
			console.log('Joined ', groupId, roomId)
      socket.join(roomId);
    });

    socket.on('message', ({ roomId, message, username, time }) => {
			console.log('Meesage ', roomId, message, username)
      io.to(roomId).emit('message', { message, username, time });
    });

    socket.on('leaveRoom', ({ roomId }) => {
      socket.leave('Leave room ', roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnect');
    });
  });
}

module.exports = setupSocketIo;
