import { Schema, model } from 'mongoose';

export interface IArtist {
  _id?: string;
  name: string;
  location?: string;
  yearsActive?: string;
  artistArt?: string;
  addedByUserId: string;
  createdAt: string;
  updatedAt: string;
};

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  location: { type: String, required: false },
  yearsActive: { type: String, required: false },
  artistArt: { type: String, required: false },
  addedByUserId: { type: String, required: true },
});

export const ArtistModel = model<IArtist>('artist', ArtistSchema);