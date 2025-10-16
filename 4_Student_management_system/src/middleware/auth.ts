import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = typeof req.query.token === 'string' ? req.query.token : null;
  

  

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}
