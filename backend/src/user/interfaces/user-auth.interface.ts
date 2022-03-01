import { Request } from 'express';
import { User } from '../user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
