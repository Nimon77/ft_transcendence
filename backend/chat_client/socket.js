const socket = (url, token) => {
  const client = io(url, {
    transportOptions: {
      polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
    },
  });

  client.on('join', console.log);

  client.on('connect', () => {
    console.log('Connected');

    client.emit('leave', 2);
  });
  client.on('disconnect', () => console.log('Disconnected'));

  event(client);
};
