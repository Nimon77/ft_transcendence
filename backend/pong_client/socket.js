const socket = (url, token) => {
  const client = io(url, {
    transportOptions: {
      polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
    },
  });

  client.on('connect', () => {
    console.log('Connected');
    client.emit(
      'room',
      new URL(document.location.href).searchParams.get('code'),
    );
  });
  client.on('disconnect', () => console.log('Disconnected'));

  event(client);
};
