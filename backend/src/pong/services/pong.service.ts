import { Injectable } from '@nestjs/common';
import { Room } from '../interfaces/room.interface';
//import { RoomService } from './room.service';

@Injectable()
export class PongService {
    //constructor( private readonly game: RoomService,) {}
    velocity = (speed, radian) => {
        return { x: Math.cos(radian) * speed, y: Math.sin(radian) * speed };
    }
    update(room : Room)
    {
        const next = {
            x: room.ball.x + room.ball.velocity.x,
            y: room.ball.y + room.ball.velocity.y,
        };
        // sides + score
        if (next.x - room.option.ball.radius < 0 || next.x + room.option.ball.radius > room.option.display.width)
        {
            if (next.x - room.option.ball.radius < 0)
                ++room.player[0].score;
            else
                ++room.player[1].score;
            for (const player of room.player)
                player.socket.emit('socre', room.option.score);

            //MODIFY
            if (room.player[0].score == room.option.score.max)
                return;
            else if (room.player[1].score == room.option.score.max)
                return;

            let ajust = 0;
            if (next.x + room.option.ball.radius > room.option.display.width)
                ajust = Math.PI;
            return this.updateBall(room.option.display.width / 2, room.option.display.height / 2, (Math.random() * Math.PI) / 2 - Math.PI / 4 + ajust, room);
        }
        // player 1
        if (next.y >= room.player[0].tray - room.option.tray.height / 2 && next.y <= room.player[0].tray + room.option.tray.height / 2)
            if (next.x - room.option.ball.radius < room.option.tray.x)
              return this.updateBall(room.ball.x, room.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4, room);
        //player 2
        if (next.y >= room.player[1].tray - room.option.tray.height / 2 && next.y <= room.player[1].tray + room.option.tray.height / 2)
            if (next.x + room.option.ball.radius > room.option.display.width - room.option.tray.x)
              return this.updateBall(room.ball.x, room.ball.y, (Math.random() * Math.PI) / 2 - Math.PI / 4 + Math.PI, room);
        //floor n top
        if (next.y - room.option.ball.radius < 0 || next.y + room.option.ball.radius >room.option.display.height)
            room.ball.velocity.y *= -1;
        //normal behavior
        room.ball.x += room.ball.velocity.x;
        room.ball.y += room.ball.velocity.y;
        for (const player of room.player)
            player.socket.emit('ball', room.ball);
    }
    updateBall(x : number, y : number, radian : number, room: Room)
    {
        room.ball.x = x;
        room.ball.y = y;
        room.ball.velocity = this.velocity(room.option.ball.speed, radian);
        for (const player of room.player)
            player.socket.emit('ball', room.ball);
    }
}
