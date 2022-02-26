const create = (tag, msg) => {
    const div = document.createElement('div');
    div.className = `message ${tag}`;
    const p = document.createElement('p');
    p.append(msg);
    div.append(p);
    const main = document.getElementsByTagName('main')[0];
    main.insertBefore(div, main.firstChild);
  };

  let me;

  socket.on('info', (data) => (me = data.user));
  socket.on('send', (data) =>
    create(data.user.id == me.id ? 'me' : 'other', data.value),
  );

  const input = document.querySelector('input');
  const send = () => {
    if (input.value.length == 0) return;
    socket.emit('send', input.value);
    input.value = '';
  };

  document
    .getElementsByTagName('form')[0]
    .addEventListener('submit', (event) => {
      event.preventDefault();
      send();
    });