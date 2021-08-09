import { NextFunction, Request, Response } from 'express';

export const index = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({"status": "green"});
  } catch (error) {
    next(error);
  }
}
