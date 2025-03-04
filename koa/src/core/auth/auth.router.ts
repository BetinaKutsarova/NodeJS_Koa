import Router from 'koa-router';
import { validator } from '../validator';
import { loginValidationSchema, registerValidationSchema } from './auth.validation-schema';
import { AuthService } from './auth.service';
import { User } from '../modules/users';

export const authRouter = new Router({
  prefix: '/auth'
});

authRouter.post(
  '/register',
  validator(registerValidationSchema),
  async (ctx) => {
    try {
      const userData = ctx.request.body as Omit<User, "_id" | "createdAt">;
      const user = await AuthService.register(userData);

      ctx.status = 201;
      ctx.body = {
        message: 'User registered successfully',
        user
      };
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = {
        error: {
          message: error.message
        }
      };
    }
  }
);

authRouter.post(
  '/login',
  validator(loginValidationSchema),
  async (ctx) => {
    try {
      const { email, password } = ctx.request.body as { email: string; password: string };
      const result = await AuthService.login(email, password);

      ctx.body = {
        message: 'Login successful',
        ...result
      };
    } catch (error: any) {
      ctx.status = 401;
      ctx.body = {
        error: {
          message: error.message
        }
      };
    }
  }
);