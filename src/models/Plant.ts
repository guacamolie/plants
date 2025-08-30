import { ObjectId } from 'mongodb';

export interface Plant {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  sku?: string;
}
