import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpExceptions';
import UserModel from '../models/user.models';

const authenticatorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.cookies.SESSION_ID;
        if (sessionId) {
            const user = await UserModel.findOne({ sessionId });
            console.log(user);
            if (user) {
                // add user details to res.locals
                res.locals.user = { username: user.username, firstName: user.firstName, lastName: user.lastName };
                next();
                return;
            }
        }
        next(new HttpException(403, 'Not Authorized'));
    } catch (error) {
        next(error);
    }
};

export default authenticatorMiddleware;
