import { Request } from 'express';
import { User } from '../../database/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
