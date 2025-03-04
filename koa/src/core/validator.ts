import { Context, Next } from 'koa';
import { Schema, ValidationError } from 'yup';

export function validator(schema: Schema) {
  return async (ctx: Context, next: Next) => {
    try {
      const data = ctx.request.body;

      const validatedData = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      ctx.request.body = validatedData;
      return next();

    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.status = 400;
        ctx.body = {
          error: {
            message: 'Validation Error',
            details: error.errors
          }
        };
        return;
      }

      throw error;
    }
  };
}