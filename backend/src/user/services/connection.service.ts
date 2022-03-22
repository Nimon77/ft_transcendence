import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from '../entities/connection.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getConnection(where: any, relations: string[]): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where,
      relations,
    });
    if (!connection)
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);

    return connection;
  }

  async createConnection(userId: number): Promise<Connection> {
    let connection = await this.getConnection({ user: userId }, []).catch(
      () => null,
    );

    if (connection)
      throw new HttpException(
        'User already have a connection',
        HttpStatus.CONFLICT,
      );
    connection = this.connectionRepository.create({ user: { id: userId } });

    try {
      await this.connectionRepository.save(connection);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return connection;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateConnection(connectionId: number, data: any): Promise<any> {
    try {
      await this.connectionRepository.update(connectionId, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateOTP(userId: number, secret?: string): Promise<void> {
    const connection = await this.getConnection({ user: userId }, []);

    try {
      await this.connectionRepository.update(connection.id, {
        otp: secret,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
