const socket = (url, token) => {
  const client = io(url, {
    transportOptions: {
      polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
    },
  });

  client.on('connect', function () {
    console.log('Connected');
  });

  client.on('disconnect', function () {
    console.log('Disconnected');
  });

  event(client);
};
