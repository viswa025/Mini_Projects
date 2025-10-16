import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import userRoute from './routes/user';
import studentRoute from './routes/student';
import marksheetRoute from './routes/marksheet';
import attendanceRoute from './routes/attendance';
import auth from './middleware/auth';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/users', userRoute);
app.use('/api/', studentRoute);
app.use('/api/marksheet', marksheetRoute);
app.use('/api/attendance', attendanceRoute);


app.get('/', (_req, res) => res.redirect('/login'));
app.get('/register', (_req, res) => res.sendFile(path.join(__dirname, '../public/html/register.html')));
app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, '../public/html/login.html')));
app.get('/home', auth, (_req, res) => res.sendFile(path.join(__dirname, '../public/html/home.html')));
app.get('/students', auth, (_req, res) => res.sendFile(path.join(__dirname, '../public/html/students.html')));
app.get('/marksheet', auth, (_req, res) => res.sendFile(path.join(__dirname, '../public/html/marksheet.html')));
app.get('/attendance', auth, (_req, res) => res.sendFile(path.join(__dirname, '../public/html/attendance.html')));




app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
