import { Controller, Get, Post, Param, Body, Delete, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../infrastructure/user.entity';


@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: string){
        return this.userService.getUserById(Number(id));
    }

    @Post()
    createUser(@Body() user: User){
        return this.userService.createUser(user);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string){
        this.userService.deleteUser(Number(id));
    }
}
