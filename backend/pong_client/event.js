const canvas = document.getElementById('pong');

let me;
let pong = null;

const handleMouseMove = (event) => {
  if (!pong) return;
  const y = event.pageY;

  if (y < canvas.clientTop) return;
  if (y > canvas.clientTop + canvas.clientHeight) return;

  pong.updateTray(
    me,
    ((event.pageY - canvas.clientTop) * 100) / canvas.clientHeight,
  );
};

const event = (socket) => {
  socket.on('info', (info) => {
    me = info.user;
  });

  socket.on('room', (code) => {
    console.log(`Joined code ${code}`);

    socket.emit('ready', { plan: 0, mode: 0 });
  });

  socket.on('start', (options, users) => {
    pong = new Pong(canvas, options, me.id, users);
    document.addEventListener('mousemove', handleMouseMove);
    console.log('Game started!');
  });

  socket.on('ball', (ball) => pong.updateBall(ball.x, ball.y, ball.velocity));
  socket.on('score', (scores) => pong.updateScore(scores));
  socket.on('tray', (player, tray) => pong.updateTray(player, tray));

  socket.on('stop', (user) => {
    window.alert(`${user.username} has won!`);
    document.removeEventListener('mousemove', handleMouseMove);
    delete pong;
    pong = null;
  });
};
