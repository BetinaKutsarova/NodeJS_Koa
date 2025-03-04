export interface PrivateItem {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}