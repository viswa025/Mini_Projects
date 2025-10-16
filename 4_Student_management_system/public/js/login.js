document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const res = await fetch('/api/users/login', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem('token', data.token);
   
    
  window.location.href = `/home?token=${data.token}`;
  } else {
    alert(data.msg || 'Login failed');
  }
});
