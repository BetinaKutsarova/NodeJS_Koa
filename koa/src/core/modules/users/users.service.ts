import bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { db } from '../../db';
import { User, UserResponse } from './users.interface';

export class UserService {
  static async getAll(): Promise<UserResponse[]> {
    const users = await db.users.getAll();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as UserResponse;
    });
  }

  static async getById(id: string): Promise<UserResponse | null> {
    const user = await db.users.get(id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }

  static async create(userData: Omit<User, '_id' | 'createdAt'>): Promise<UserResponse> {
    const existingUser = await db.users.findOne(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: User = {
      _id: crypto.randomUUID(),
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };

    await db.users.add(user._id, user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserResponse;
  }

  static async update(id: string, userData: Partial<User>): Promise<UserResponse | null> {
    const existingUser = await db.users.get(id);
    if (!existingUser) return null;

    let updatedData: Partial<User> = { ...userData };
    if (userData.password) {
      updatedData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await db.users.update(id, updatedData);
    if (!updatedUser) return null;

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as UserResponse;
  }

  static async delete(id: string): Promise<boolean> {
    return await db.users.delete(id);
  }
}