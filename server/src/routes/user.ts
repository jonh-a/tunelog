import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel, IUser } from '../models/user';
import dayjs from 'dayjs';
import app from '../../app';
import verifyToken from '../middleware/verifyToken';

dotenv.config();

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username = '', password = '', email = '' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Credentials not provided.' });
        }

        const user = await UserModel.findOne({ $or: [{ username }, { email }] });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPass });
        await newUser.save();

        const sessionData = {
            id: newUser._id,
        };
        const token = jwt.sign(sessionData, req.app.locals?.JWT_SECRET || '');

        res.cookie('access_token', token, {
            secure: app.locals?.PROD || false,
            httpOnly: true,
            expires: dayjs().add(30, 'days').toDate(),
        });

        res.json({ success: true });

        return res.send();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username = '', password = '' } = req.body;
        const user: IUser = await UserModel.findOne({ username });

        if (!user) return res.status(403).json({ success: false, message: 'Failed to authenticate.' });

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return res.status(403).json({ success: false, message: 'Failed to authenticate.' });

        const sessionData = {
            id: user._id,
        };
        const token = jwt.sign(sessionData, req.app.locals?.JWT_SECRET || '');

        res.cookie('access_token', token, {
            secure: app.locals?.PROD || false,
            httpOnly: true,
            expires: dayjs().add(30, 'days').toDate(),
        });

        res.json({ success: true });

        return res.send();
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});

router.get('/logout', verifyToken, (req: Request, res: Response) => {
    try {
        res.cookie('access_token', 'none', {
            expires: new Date(Date.now() + 1 * 1000),
            httpOnly: true
        });

        return res.json({ success: true });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});

router.get('/authenticated', verifyToken, (req: Request, res: Response) => {
    try {
        return res.json({ success: true });
    } catch (e) {
        return res.status(403).json({ success: false });
    }
});

router.get('/settings', verifyToken, async (req: Request, res: Response) => {
    try {
        const { userID = '' } = res.locals;
        if (!userID) return res.status(403).json({ success: false, message: 'Unauthenticated.' });
        const user = await UserModel.findOne({ _id: userID });
        if (user) return { success: true, items: user };
        return res.status(500).json({ success: false, message: 'An unexpected error occurred. ' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
    }
});