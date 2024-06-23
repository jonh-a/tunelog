import { Schema, model } from 'mongoose';

export interface IAlbum {
  _id?: string;
  artistName: string;
  artistId: string;
  name: string;
  releaseDate?: Date;
  albumArt?: string;
  createdAt: string;
  updatedAt: string;
  addedByUserId: string;
};

const AlbumSchema = new Schema<IAlbum>({
  artistName: { type: String, required: true },
  artistId: { type: String, required: true },
  name: { type: String, required: true },
  albumArt: { type: String, required: false },
  releaseDate: { type: Date, required: false },
  addedByUserId: { type: String, required: true },
});

export const AlbumModel = model<IAlbum>('album', AlbumSchema);