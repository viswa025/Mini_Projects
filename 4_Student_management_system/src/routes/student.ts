import { Router, Request, Response } from 'express';
import { query } from '../db';
import auth from '../middleware/auth';

const router = Router();


router.use(auth);

// create
router.post('/students', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, age, dob } = req.body;
    const r = await query(
      'INSERT INTO students(name,email,phone,age,dob) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [name, email, phone, age, dob]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// list
router.get('/students', async (_req: Request, res: Response) => {
  try {
    const r = await query('SELECT * FROM students ORDER BY student_id');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// single
router.get('/students/:id', async (req: Request, res: Response) => {
  try {
    const r = await query('SELECT * FROM students WHERE student_id = $1', [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// update
router.put('/students/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, age, dob } = req.body;
    const r = await query(
      'UPDATE students SET name=$1,email=$2,phone=$3,age=$4,dob=$5 WHERE student_id=$6 RETURNING *',
      [name, email, phone, age, dob, req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// delete
router.delete('/students/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM students WHERE student_id = $1', [req.params.id]);
    res.json({ msg: 'Deleted' });
    console.log(res.json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
