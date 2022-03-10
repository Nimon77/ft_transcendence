let me;
let code = null;

const event = (socket) => {
  socket.on('info', (info) => {
    me = info.user;
  });

  socket.on('room', (code) => {
    console.log(`Joined code ${code}`);
    this.code = code;
  });
};
