import express from 'express';

interface User {
  userId: number;
}

export interface Request extends express.Request {
  user: User;
}
