import Router from 'koa-router';
import { validator } from '../../validator';
import { authMiddleware } from '../../auth';
import { createPrivateItemSchema, updatePrivateItemSchema } from './private.validation-schema';
import { PrivateService } from './private.service';
import { PrivateItem } from './private.interface';

export const privateRouter = new Router({
  prefix: '/private'
});

privateRouter.use(authMiddleware);

privateRouter.get('/', async ctx => {
  const userId = ctx.state.user._id;
  const items = await PrivateService.getAll(userId);
  ctx.body = items;
});

privateRouter.get('/:id', async ctx => {
  const { id } = ctx.params;
  const userId = ctx.state.user._id;

  const item = await PrivateService.getById(id, userId);
  if (!item) {
    ctx.status = 404;
    ctx.body = { error: { message: 'Item not found' } };
    return;
  }

  ctx.body = item;
});


privateRouter.post(
  '/',
  validator(createPrivateItemSchema),
  async ctx => {
    const userId = ctx.state.user._id;
    const itemData = ctx.request.body as Omit<PrivateItem, "_id" | "createdAt" | "userId">;

    console.log('do tuka idvame li')

    const item = await PrivateService.create(itemData, userId);
    ctx.status = 201;
    ctx.body = item;
  }
);


privateRouter.put(
  '/:id',
  validator(updatePrivateItemSchema),
  async ctx => {
    const { id } = ctx.params;
    const userId = ctx.state.user._id;
    const itemData = ctx.request.body as Partial<PrivateItem>;

    const updatedItem = await PrivateService.update(id, userId, itemData);
    if (!updatedItem) {
      ctx.status = 404;
      ctx.body = { error: { message: 'Item not found' } };
      return;
    }

    ctx.body = updatedItem;
  }
);


privateRouter.delete('/:id', async ctx => {
  const { id } = ctx.params;
  const userId = ctx.state.user._id;

  const deleted = await PrivateService.delete(id, userId);
  if (!deleted) {
    ctx.status = 404;
    ctx.body = { error: { message: 'Item not found' } };
    return;
  }

  ctx.status = 204;
});