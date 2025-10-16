document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/login';

  // ensure nav links have token
 ['nav-home','nav-students','nav-marksheet','nav-attendance'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getAttribute('href')) {
      const base = el.getAttribute('href').split('?')[0];
      el.setAttribute('href', `${base}?token=${token}`);
    }
  }); 

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  });

  const addBtn = document.getElementById('add-student');
  const form = document.getElementById('student-form');
  const cancelBtn = document.getElementById('cancel-student');

  const tableBody = document.querySelector('#students-table tbody');

  addBtn.addEventListener('click', () => {
    document.getElementById('student-id').value = '';
    form.style.display = 'block';
  });
  cancelBtn.addEventListener('click', () => form.style.display = 'none');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const payload = {
      name: document.getElementById('sname').value.trim(),
      email: document.getElementById('semail').value.trim(),
      phone: document.getElementById('sphone').value.trim(),
      age: Number(document.getElementById('sage').value),
      dob: document.getElementById('sdob').value
    };
    try {
      let res;
      if (id) {
        res = await fetch(`/api/students/${id}?token=${token}`, {
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/students?token=${token}`, {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error('Save failed');
      form.style.display = 'none';
      loadStudents();
    } catch (err) {
      alert(err.message || 'Error');
    }
  });

  async function loadStudents() {
    tableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    const res = await fetch(`/api/students?token=${token}`);

    if (!res.ok) return window.location.href='/login';
    const data = await res.json();
    if (!Array.isArray(data) || data.length===0) {
      tableBody.innerHTML = '<tr><td colspan="7">No students</td></tr>';
      return;
    }
    tableBody.innerHTML = '';
    data.forEach((s,i) => {
      const id = s.student_id; //wait 
      const dob = s.dob ? new Date(s.dob).toISOString().slice(0,10) : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${s.name || ''}</td>
          <td>${s.email || ''}</td>
          <td>${s.phone || ''}</td>
          <td>${s.age || ''}</td>
          <td>${dob}</td>
          <td class="actions">
            <button class="btn btn-sm edit" data-id="${id}">Edit</button>
            <button class="btn btn-sm danger delete" data-id="${id}">Delete</button>
          </td>`;

      tableBody.appendChild(tr);
    });
    document.querySelectorAll('.edit').forEach(b => b.addEventListener('click', onEdit));
    document.querySelectorAll('.delete').forEach(b => b.addEventListener('click', onDelete));
  }

  async function onEdit(e) {
    const id = e.currentTarget.dataset.id;
    const res = await fetch(`/api/students/${id}?token=${token}`);

    if (!res.ok) return alert('Fetch failed');
    const s = await res.json();
    document.getElementById('student-id').value = id;
    document.getElementById('sname').value = s.name || '';
    document.getElementById('semail').value = s.email || '';
    document.getElementById('sphone').value = s.phone || '';
    document.getElementById('sage').value = s.age || '';
    document.getElementById('sdob').value = s.dob ? new Date(s.dob).toISOString().slice(0,10) : '';
    form.style.display = 'block';
  }

  async function onDelete(e) {
    const id = e.currentTarget.dataset.id;
    if (!confirm('Delete?')) return;
    const res = await fetch(`/api/students/${id}?token=${token}`, {  method: 'DELETE'});
console.log(res);
    if (!res.ok) return alert('Delete failed');
    loadStudents();
  }

 
  loadStudents();
});
