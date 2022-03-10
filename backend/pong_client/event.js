let me;

const event = (socket) => {
  socket.on('info', (info) => {
    me = info.user;
  });

  socket.on('room', (code) => {
    console.log(`Joined code ${code}`);
    const url = new URL(document.location.href);
    if (!url.searchParams.has('code')) {
      url.searchParams.set('code', code);
      document.location.href = url.href;
    }
  });
};
