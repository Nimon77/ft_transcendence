let me;
let channels;
let currentChannel = null;

const createChannel = (channel, socket) => {
  const button = document.createElement('button');
  button.append(channel.name);
  button.id = channel.id;

  button.onclick = () => {
    if (currentChannel == channel.id) return;
    socket.emit('channel', channel.id);
  };

  const main = document.getElementById('channel');
  main.append(button);
};

const createMessage = (message) => {
  const div = document.createElement('div');
  if (message.user.id == me.id) {
    div.classList.add('me');
    document.querySelector('input').value = '';
  }

  {
    const author = document.createElement('div');
    author.classList.add('author');
    author.append(message.user.username);
    author.id = message.user.id;
    div.append(author);
  }
  {
    const text = document.createElement('div');
    text.classList.add('text');
    text.append(message.value);
    div.append(text);
  }

  const chat = document.getElementById('chat');
  const main = chat.getElementsByTagName('main')[0];
  main.insertBefore(div, main.firstChild);
};

const createUser = (user) => {
  const div = document.createElement('div');
  div.append(user.username);
  div.id = user.id;

  const main = document.getElementById('user');
  main.append(div);
};

const event = (socket) => {
  socket.on('info', (info) => {
    me = info.user;
    for (const channel of info.channels) createChannel(channel, socket);
  });

  socket.on('channel', (channel) => {
    if (currentChannel)
      document.getElementById(currentChannel).classList.remove('active');
    document.getElementById(channel.id).classList.add('active');
    currentChannel = channel.id;

    {
      const user = document.getElementById('user');
      const childs = Array.from(user.childNodes);
      for (const child of childs)
        if (child.nodeName == 'DIV') user.removeChild(child);
    }
    {
      const chat = document.getElementById('chat');
      const main = chat.getElementsByTagName('main')[0];
      const childs = Array.from(main.childNodes);
      for (const child of childs)
        if (child.nodeName == 'DIV') main.removeChild(child);
    }

    for (const user of channel.users) createUser(user);
  });

  socket.on('text', (message) => createMessage(message));

  document
    .getElementsByTagName('form')[0]
    .addEventListener('submit', (event) => {
      event.preventDefault();
      if (currentChannel == null) return;

      socket.emit('text', {
        id: currentChannel,
        value: document.querySelector('input').value,
      });
    });
};
