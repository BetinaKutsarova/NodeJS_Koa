import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { db } from '../db';

export async function authMiddleware(ctx: Context, next: Next) {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Authentication required' } };
      return;
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };

    const user = await db.users.get(decoded.userId);
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'Invalid token' } };
      return;
    }

    ctx.state.user = user;

    return next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: { message: 'Invalid or expired token' } };
  }
}