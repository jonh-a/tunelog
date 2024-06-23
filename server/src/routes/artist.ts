import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ArtistModel } from '../models/artist';
import verifyToken from '../middleware/verifyToken';

dotenv.config();

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const artists = await ArtistModel.find({})
    return res.json({ success: true, items: artists })
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({
        success: false,
        message: 'An unexpected error occurred.'
      });
  }
})

router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { name = '', location = '', yearsActive = '' } = req.body;
    const matchingArtists = await ArtistModel.findOne({ name, location, yearsActive })
    if (matchingArtists) {
      return res
        .status(400)
        .json({
          success: false,
          error: 'Artists matching this criteria were found.',
          data: matchingArtists,
        })
    }

    const { userID = '' } = res.locals;
    const newArtist = new ArtistModel({ name, location, yearsActive, addedByUserId: userID })
    const artist = await newArtist.save()
    return res.json({ success: true, items: artist })
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({
        success: false,
        message: 'An unexpected error occurred.'
      });
  }
})

export { router as artistRouter };