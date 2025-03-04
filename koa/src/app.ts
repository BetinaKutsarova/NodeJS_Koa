import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from 'koa-router';

import { authRouter } from './core';
import { userRouter } from './core/modules/users';
import { privateRouter } from './core/modules/private-module';

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal Server Error',
        status: ctx.status
      }
    };
    ctx.app.emit('error', err, ctx);
  }
});

const rootRouter = new Router({ prefix: '/api' });
rootRouter.use(authRouter.routes());
rootRouter.use(userRouter.routes());
rootRouter.use(privateRouter.routes());

app.use(rootRouter.routes());
app.use(rootRouter.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('Error:', err);
});

export { app };