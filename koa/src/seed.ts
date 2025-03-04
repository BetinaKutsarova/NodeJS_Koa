import * as crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { db } from './core/db';
import { User } from './core/modules/users';
import { config } from './config';

export async function seedAdmin() {
  try {
    const usersPath = path.join(config.db.filePath, 'users.json');
    const itemsPath = path.join(config.db.filePath, 'private-items.json');

    console.log(usersPath);
    await fs.writeFile(usersPath, '[]', 'utf-8');
    console.log('Users database cleared');
    console.log(itemsPath);
    await fs.writeFile(itemsPath, '[]', 'utf-8');
    console.log('Items database cleared');
  } catch (error) {
    console.error('Error clearing users database:', error);
    throw error;
  }


  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  const admin: User = {
    _id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  await new Promise(resolve => setTimeout(resolve, 100));

  await db.users.add(admin._id, admin);
  console.log('Admin user created');
}