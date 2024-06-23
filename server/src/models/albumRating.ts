import { Schema, model } from 'mongoose';

export interface IAlbumRating {
  _id?: string;
  albumId: string;
  userId: string;
  stars: number;
  title?: string;
  review?: string;
  genres?: string[];
  createdAt: string;
  updatedAt: string;
};

const AlbumRatingSchema = new Schema<IAlbumRating>({
  albumId: { type: String, required: true },
  userId: { type: String, required: true },
  stars: { type: Number, required: true },
  title: { type: String, required: false },
  review: { type: String, required: false },
  genres: { type: [String], required: false },
});

export const AlbumRatingModel = model<IAlbumRating>('albumRating', AlbumRatingSchema);