import { Router, Request, Response } from "express";
import { query } from "../db";

const router = Router();

// ✅ Record attendance
router.post("/", async (req: Request, res: Response) => {
  const { date, records } = req.body;
  try {
    // Remove existing attendance for the date to prevent duplicates
    await query("DELETE FROM attendance WHERE date = $1", [date]);

    const promises = records.map((r: any) =>
      query("INSERT INTO attendance(student_id, status, date) VALUES($1, $2, $3)", [
        r.student_id,
        r.status,
        date,
      ])
    );
    await Promise.all(promises);
    res.json({ msg: "Attendance recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get attendance summary
router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const total = Number((await query("SELECT COUNT(*) FROM students")).rows[0].count);
    const present = Number(
      (await query("SELECT COUNT(*) FROM attendance WHERE status=true AND date=CURRENT_DATE"))
        .rows[0].count
    );
    const absent = Number(
      (await query("SELECT COUNT(*) FROM attendance WHERE status=false AND date=CURRENT_DATE"))
        .rows[0].count
    );

    res.json({ total, present, absent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
