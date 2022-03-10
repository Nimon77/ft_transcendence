const socket = (url, token) => {
  const client = io(url, {
    transportOptions: {
      polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
    },
  });

  client.on('connect', () => {
    console.log('Connected');
	client.emit('queue');
  });
  client.on('disconnect', () => console.log('Disconnected'));

  event(client);
};
