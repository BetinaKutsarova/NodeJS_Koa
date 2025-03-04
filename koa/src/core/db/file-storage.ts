import fs from 'fs/promises';
import path from 'path';
import { config } from '../../config';

class FileStorage<T extends { _id: string }> {
  private filePath: string;
  private data: Map<string, T> = new Map();
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.filePath = path.join(config.db.filePath, `${collectionName}.json`);
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });

      try {
        const fileData = await fs.readFile(this.filePath, 'utf-8');
        if (fileData.trim()) {
          const parsedData = JSON.parse(fileData) as T[];
          parsedData.forEach(item => {
            this.data.set(item._id, item);
          });
        } else {
          await this.save();
        }
      } catch (error: any) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
          await this.save();
        } else {
          console.error(`Error reading ${this.collectionName} data:`, error);
        }
      }
    } catch (error) {
      console.error(`Error initializing storage for ${this.collectionName}:`, error);
    }
  }

  private async save(): Promise<void> {
    try {
      const dataArray = Array.from(this.data.values());
      await fs.writeFile(this.filePath, JSON.stringify(dataArray, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Error saving ${this.collectionName} data:`, error);
      throw new Error(`Failed to save ${this.collectionName} data`);
    }
  }

  async add(id: string, item: T): Promise<T> {
    this.data.set(id, item);
    await this.save();
    return item;
  }

  async get(id: string): Promise<T | undefined> {
    return this.data.get(id);
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  async update(id: string, item: Partial<T>): Promise<T | undefined> {
    const existingItem = this.data.get(id);
    if (!existingItem) return undefined;

    const updatedItem = { ...existingItem, ...item, _id: id } as T;
    this.data.set(id, updatedItem);
    await this.save();
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.data.delete(id);
    if (deleted) {
      await this.save();
    }
    return deleted;
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | undefined> {
    for (const item of this.data.values()) {
      if (predicate(item)) {
        return item;
      }
    }
    return undefined;
  }
}

export { FileStorage };