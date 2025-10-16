document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;
  if (password !== confirm) return alert('Passwords do not match');
  const res = await fetch('/api/users/register', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (res.ok) { alert('Registered — please login'); window.location.href='/login'; }
  else alert(data.msg || 'Register failed');
});
