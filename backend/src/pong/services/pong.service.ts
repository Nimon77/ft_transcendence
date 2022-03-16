import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Room } from '../interfaces/room.interface';
import { RoomService } from './room.service';

@Injectable()
export class PongService {
  constructor(
    @Inject(forwardRef(() => RoomService)) private roomService: RoomService,
  ) {}

  velocity = (speed, radian) => {
    return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  };

  update(room: Room) {
    const next = {
      x: room.ball.x + room.ball.velocity.x,
      y: room.ball.y + room.ball.velocity.y,
    };
    // sides + score
    if (
      next.x - room.options.ball.radius < 0 ||
      next.x + room.options.ball.radius > room.options.display.width
    ) {
      if (next.x > room.options.ball.radius) ++room.players[0].score;
      else ++room.players[1].score;

      this.roomService.emit(
        room,
        'score',
        room.players.map((player) => player.score),
      );

      for (const player of room.players)
        if (player.score == room.options.score.max)
          return this.roomService.stopGame(room, player);
        // if (player.score == 1)
        //   return this.roomService.stopGame(room, player);

      let ajust = 0;
      if (next.x + room.options.ball.radius > room.options.display.width)
        ajust = Math.PI;
      return this.updateBall(
        room.options.display.width / 2,
        room.options.display.height / 2,
        (Math.random() * Math.PI) / 2 - Math.PI / 4 + ajust,
        room,
      );
    }
    // player 1
    if (
      next.y >= room.players[0].tray - room.options.tray.height / 2 &&
      next.y <= room.players[0].tray + room.options.tray.height / 2
    )
      if (next.x - room.options.ball.radius < room.options.tray.x)
        return this.updateBall(
          room.ball.x,
          room.ball.y,
          (Math.random() * Math.PI) / 2 - Math.PI / 4,
          room,
        );
    //player 2
    if (
      next.y >= room.players[1].tray - room.options.tray.height / 2 &&
      next.y <= room.players[1].tray + room.options.tray.height / 2
    )
      if (
        next.x + room.options.ball.radius >
        room.options.display.width - room.options.tray.x
      )
        return this.updateBall(
          room.ball.x,
          room.ball.y,
          (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI,
          room,
        );
    //floor n top
    if (
      next.y - room.options.ball.radius < 0 ||
      next.y + room.options.ball.radius > room.options.display.height
    )
      room.ball.velocity.y *= -1;
    //normal behavior
    room.ball.x += room.ball.velocity.x;
    room.ball.y += room.ball.velocity.y;
    this.roomService.emit(room, 'ball', room.ball);
  }

  updateBall(x: number, y: number, radian: number, room: Room) {
    room.ball.x = x;
    room.ball.y = y;
    room.ball.velocity = this.velocity(room.options.ball.speed, radian);
    this.roomService.emit(room, 'ball', room.ball);
  }
}
