import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import UserModel from '../models/user.models';
import HttpException from '../exceptions/HttpExceptions';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (user && bcrypt.compareSync(password, user.hash)) {
            const sessionId = crypto.randomBytes(64).toString('hex');
            await UserModel.updateOne({ username }, { sessionId });
            res.setHeader('set-cookie', [`SESSION_ID=${sessionId}; httponly`]);
            res.send({ message: 'logged in successfully', username });
            return;
        }
        throw new HttpException(401, 'Incorrect Username or Password');
    } catch (error) {
        next(error);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, firstName, lastName } = req.body;
        const user = await UserModel.findOne({ username });
        if (user) {
            throw new HttpException(422, 'User already exists');
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            hash: hashedPass,
            firstName,
            lastName,
        });
        await newUser.save();
        res.status(201).send({ message: 'user created' });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.cookies.SESSION_ID;
        if (sessionId) {
            await UserModel.findOneAndUpdate({ sessionId }, { sessionId: null });
            res.send({ message: 'logged out successfully' });
            return;
        }
        throw new HttpException(422, 'User not logged in.');
    } catch (error) {
        next(error);
    }
};
