document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return (window.location.href = '/login');

   ['nav-home','nav-students','nav-marksheet','nav-attendance'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getAttribute('href')) {
      const base = el.getAttribute('href').split('?')[0];
      el.setAttribute('href', `${base}?token=${token}`);
    }
  }); 



  const tableBody = document.querySelector('#attendance-table tbody');

  async function loadStudents() {
    const res = await fetch(`/api/students?token=${token}`);
    const students = await res.json();
    tableBody.innerHTML = '';
    students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.name}</td>
        <td><input type="radio" name="status-${s.student_id}" value="present"></td>
        <td><input type="radio" name="status-${s.student_id}" value="absent"></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  document.getElementById('submit-attendance').addEventListener('click', async () => {
    const rows = tableBody.querySelectorAll('tr');
    const records = [];
    rows.forEach(row => {
      const studentName = row.children[0].textContent;
      const present = row.children[1].querySelector('input').checked;
      const absent = row.children[2].querySelector('input').checked;
      const status = present ? true : false;
      if (present || absent) {
        const student = row.children[1].querySelector('input').name.split('-')[1];
        records.push({ student_id: student, status });
      }
    });

    if (records.length === 0) return alert('No attendance selected.');

    const res = await fetch(`/api/attendance?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: new Date().toISOString().split('T')[0], records }),
    });

    if (!res.ok) return alert('Error saving attendance');

    alert('Attendance saved successfully');
    await summary();
  });

  async function summary() {
    const res = await fetch(`/api/attendance/summary?token=${token}`);
    const data = await res.json();
    document.getElementById('total').textContent = data.total;
    document.getElementById('present').textContent = data.present;
    document.getElementById('absent').textContent = data.absent;
  }

  loadStudents();
  summary();

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });
});
