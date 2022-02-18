import { Request } from 'express';
import { User } from '../../infrastructure/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
