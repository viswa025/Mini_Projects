document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/login';




  // append token to protected page links
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
});
