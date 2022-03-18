import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Room } from '../interfaces/room.interface';
import { RoomService } from './room.service';

@Injectable()
export class PongService {
  constructor(
    @Inject(forwardRef(() => RoomService)) private roomService: RoomService,
  ) {}

  static velocity = (speed, radian) => {
    return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
  };

  resetBall(room: Room, left?: boolean): void {
    let radian = (Math.random() * Math.PI) / 2 - Math.PI / 4;
    if (left) radian += Math.PI;

    room.speed = room.options.ball.speed;

    this.updateBall(
      room.options.display.width / 2,
      room.options.display.height / 2,
      radian,
      room,
    );
  }

  update(room: Room): void {
    const next = {
      x: room.ball.position.x + room.ball.velocity.x,
      y: room.ball.position.y + room.ball.velocity.y,
    };
    // sides + score
    if (
      next.x - room.options.ball.radius < 0 ||
      next.x + room.options.ball.radius > room.options.display.width
    ) {
      if (next.x > room.options.ball.radius) ++room.players[0].score;
      else ++room.players[1].score;

      RoomService.emit(
        room,
        'score',
        room.players.map((player) => player.score),
      );

      for (const player of room.players)
        if (player.score == room.options.score.max)
          return this.roomService.stopGame(room, player);

      this.resetBall(
        room,
        next.x + room.options.ball.radius > room.options.display.width,
      );
    }
    // player 1
    if (
      next.y >= room.players[0].tray - room.options.tray.height / 2 &&
      next.y <= room.players[0].tray + room.options.tray.height / 2
    )
      if (next.x - room.options.ball.radius < room.options.tray.x)
        return this.updateBall(
          room.ball.position.x,
          room.ball.position.y,
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
          room.ball.position.x,
          room.ball.position.y,
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
    room.ball.position.x += room.ball.velocity.x;
    room.ball.position.y += room.ball.velocity.y;
    RoomService.emit(room, 'ball', room.ball.position);
  }

  updateBall(x: number, y: number, radian: number, room: Room): void {
    room.ball.position.x = x;
    room.ball.position.y = y;
    room.ball.velocity = PongService.velocity((room.speed *= 1.01), radian);
    RoomService.emit(room, 'ball', room.ball.position);
  }
}
