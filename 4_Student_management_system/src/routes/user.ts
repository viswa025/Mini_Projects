import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../db';
dotenv.config();

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const exists = await query('SELECT 1 FROM users WHERE user_email = $1', [email]);
    if (exists.rows.length > 0) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const r = await query(
      'INSERT INTO users(user_name,user_email,user_password) VALUES($1,$2,$3) RETURNING user_id,user_email',
      [username, email, hashed]
    );
    res.status(201).json({ msg: 'User created', user: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const r = await query('SELECT * FROM users WHERE user_email = $1', [email]);
    if (r.rows.length === 0) return res.status(401).json({ msg: 'Invalid email' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.user_password);
    if (!ok) return res.status(401).json({ msg: 'Invalid password' });

    const payload = { user: { id: user.user_id, email: user.user_email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string );

    res.json({ msg: 'Logged in', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


export default router;
