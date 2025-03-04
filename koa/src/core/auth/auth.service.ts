import * as crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db';
import { config } from '../../config';
import { User } from '../modules/users/users.interface';

export class AuthService {
  static async register(userData: Omit<User, '_id' | 'createdAt'>) {
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
      role: 'user',
      createdAt: new Date().toISOString()
    };

    await db.users.add(user._id, user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async login(email: string, password: string) {
    const user = await db.users.findOne(user => user.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = (jwt.sign as any)(
      { userId: user._id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }
}