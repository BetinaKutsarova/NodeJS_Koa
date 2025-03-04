import { FileStorage } from './file-storage';
import { User } from '../modules/users/users.interface';
import { PrivateItem } from '../modules/private-module';

const db = {
  users: new FileStorage<User>('users'),
  privateItems: new FileStorage<PrivateItem>('private-items')
};

export { db, FileStorage };