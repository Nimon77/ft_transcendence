const socket = (url, token) => {
  const client = io(url, {
    transportOptions: {
      polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
    },
  });

  client.on('connect', () => {
    console.log('Connected');

    client.emit('join', 1);
  });
  client.on('disconnect', () => console.log('Disconnected'));

  event(client);
};
