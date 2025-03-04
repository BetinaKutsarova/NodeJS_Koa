import * as crypto from 'node:crypto';
import { db } from '../../db';
import { PrivateItem } from './private.interface';

export class PrivateService {
  static async getAll(userId: string): Promise<PrivateItem[]> {
    const allItems = await db.privateItems.getAll();
    return allItems.filter(item => item.userId === userId);
  }

  static async getById(id: string, userId: string): Promise<PrivateItem | null> {
    const item = await db.privateItems.get(id);
    if (!item || item.userId !== userId) {
      return null;
    }
    return item;
  }

  static async create(data: Omit<PrivateItem, '_id' | 'createdAt' | 'userId'>, userId: string): Promise<PrivateItem> {
    const now = new Date().toISOString();

    const privateItem: PrivateItem = {
      _id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      userId,
      createdAt: now
    };

    await db.privateItems.add(privateItem._id, privateItem);
    return privateItem;
  }

  static async update(id: string, userId: string, data: Partial<PrivateItem>): Promise<PrivateItem | null> {
    const existingItem = await db.privateItems.get(id);

    if (!existingItem || existingItem.userId !== userId) {
      return null;
    }

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    const updatedItem = await db.privateItems.update(id, updatedData);
    return updatedItem || null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const existingItem = await db.privateItems.get(id);

    if (!existingItem || existingItem.userId !== userId) {
      return false;
    }

    return await db.privateItems.delete(id);
  }
}