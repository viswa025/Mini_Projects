import { Router, Request, Response } from "express";
import { query } from "../db";

const router = Router();



function getGrade(english: number, tamil: number, maths: number, science: number, social: number) {

   if (english < 50 || tamil < 50 || maths < 50 || science < 50 || social < 50) {
    return "Fail";
  }
  const avg = (english + tamil + maths + science + social) / 5;
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  if (avg >= 50) return "E";
  return "Fail";
}


router.get("/students", async (_req: Request, res: Response) => {
  try {
    const result = await query("SELECT student_id, name FROM students ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/marks", async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        m.marksheet_id AS id, m.student_id, s.name, 
        m.english, m.tamil, m.maths, m.science, m.social_science, m.grade,m.total
      FROM marksheets m
      JOIN students s ON m.student_id = s.student_id
      ORDER BY s.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/marks", async (req: Request, res: Response) => {
  try {
    const { student_id, english, tamil, maths, science, social_science,total } = req.body;
    const existing = await query("SELECT * FROM marksheets WHERE student_id=$1", [student_id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: "Marks already exist for this student" });
    }

    const grade = getGrade(english, tamil, maths, science, social_science);

    const result = await query(
      `INSERT INTO marksheets(student_id, english, tamil, maths, science, social_science, grade,total)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [student_id, english, tamil, maths, science, social_science, grade,total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { english, tamil, maths, science, social_science,total } = req.body;
    const grade = getGrade(english, tamil, maths, science, social_science);

    const result = await query(
      `UPDATE marksheets
       SET english=$1, tamil=$2, maths=$3, science=$4, social_science=$5, grade=$6, total=$7
       WHERE marksheet_id=$8 RETURNING *`,
      [english, tamil, maths, science, social_science, grade,total, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await query("DELETE FROM marksheets WHERE marksheet_id=$1", [req.params.id]);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
