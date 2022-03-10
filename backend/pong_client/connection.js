class Connection {
  handleOpen = () => {
    const url = new URL(document.location.href);
    if (!url.searchParams.has('code'))
      return this.socket.send(JSON.stringify({ event: 'generate' }));
    this.socket.send(
      JSON.stringify({
        event: 'username',
        data: window.sessionStorage.getItem('username'),
      }),
    );
    this.socket.send(
      JSON.stringify({ event: 'join', data: url.searchParams.get('code') }),
    );
    document.getElementById('invite').style.display = 'inherit';
  };

  handleMessage = ({ data }) => {
    data = JSON.parse(data);
    switch (data.event) {
      case 'code':
        const url = new URL(document.location.href);
        url.searchParams.set('code', data.data);
        document.location.href = url.href;
        break;
      case 'start':
        document.getElementById('invite').style.display = 'none';
        this.pong = new Pong(
          document.getElementById('pong'),
          data.username[0],
          data.username[1],
        );
        if (data.position == 1) this.pong.setPlayer(this.pong.player.left);
        else {
          if (data.position == 2) this.pong.setPlayer(this.pong.player.right);
          this.pong.setHost(false);
        }
        this.pong.setSend((data) =>
          this.socket.send(JSON.stringify({ event: 'send', data })),
        );
        this.pong.setEnd((won) => {
          if (won) document.getElementById('win').style.display = 'inherit';
          else document.getElementById('lose').style.display = 'inherit';
        });
        document.getElementById('pong').style.display = 'inherit';
        this.pong.start();
        break;
      case 'receive':
        this.pong.receive(data.data);
        break;
      case 'stop':
        if (data.position == 1) this.pong.stop(this.pong.player.right);
        else this.pong.stop(this.pong.player.left);
        break;
    }
  };

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080');
    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
  }
}
