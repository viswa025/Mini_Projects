document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/login");

   ['nav-home','nav-students','nav-marksheet','nav-attendance'].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getAttribute('href')) {
      const base = el.getAttribute('href').split('?')[0];
      el.setAttribute('href', `${base}?token=${token}`);
    }
  }); 


  const API_BASE = "/api/marksheet"; 
  

  const studentSelect = document.getElementById("student-select");
  const marksTableBody = document.querySelector("#marks-table tbody");
  const saveBtn = document.getElementById("save-marks");

  let editingId = null; 

  async function loadStudents() {
    studentSelect.innerHTML = '<option value="">Select Student</option>';
    const res = await fetch(`${API_BASE}/students?token=${token}`, {
  headers: {
    "Content-Type": "application/json"
  }
});

    if (!res.ok) return alert("Failed to load students");
    const students = await res.json();
    students.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = String(s.student_id);
      opt.textContent = s.name;
      studentSelect.appendChild(opt);
    });
  }

  async function loadMarks() {
    marksTableBody.innerHTML = "<tr><td colspan='10'>Loading...</td></tr>";
    const res = await fetch(`${API_BASE}/marks?token=${token}`, {headers: { "Content-Type": "application/json" } });
    if (!res.ok) return (marksTableBody.innerHTML = "<tr><td colspan='10'>Failed to load</td></tr>");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      marksTableBody.innerHTML = "<tr><td colspan='9'>No marks found</td></tr>";
      return;
    }

    marksTableBody.innerHTML = "";
    data.forEach((row, i) => {
      const tr = document.createElement("tr");
      tr.dataset.id = String(row.id);
      tr.dataset.studentId = String(row.student_id);
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td class="cell-name">${row.name ?? ""}  </td>
        <td class="cell-english">${row.english ?? ""}</td>
        <td class="cell-tamil">${row.tamil ?? ""}</td>
        <td class="cell-maths">${row.maths ?? ""}</td>
        <td class="cell-science">${row.science ?? ""}</td>
        <td class="cell-social">${row.social_science ?? ""}</td>
        <td class="cell-grade">${row.grade ?? ""}</td>
        <td class="cell-total">${row.total ?? 0}</td>
        <td class="cell-actions">
          <button class="btn btn-small edit" data-id="${row.id}">Edit</button>
          <button class="btn btn-danger btn-small delete" data-id="${row.id}">Delete</button>
        </td>
      `;
      marksTableBody.appendChild(tr);
    });
  }

  



  saveBtn.addEventListener("click", async () => {
    const student_id = studentSelect.value;
    const english = +document.getElementById("english").value || 0;
    const tamil = +document.getElementById("tamil").value || 0;
    const maths = +document.getElementById("maths").value || 0;
    const science = +document.getElementById("science").value || 0;
    const social_science = +document.getElementById("social").value || 0;
    const total = english + tamil + maths + science + social_science;
    if (!student_id) return alert("Please select a student.");

    const payload = { student_id, english, tamil, maths, science, social_science,total };

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/${editingId}?token=${token}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ english, tamil, maths, science, social_science,total }),
        });
        if (!res.ok) throw new Error("Update failed");
        editingId = null;
        saveBtn.textContent = "Save Marks";
      } else {
        res = await fetch(`${API_BASE}/marks?token=${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
      
          if (err.msg && err.msg.toLowerCase().includes("marks already exist")) {
            
             clearForm();
              return alert("Marks already exist");
            
          }
          throw new Error(err.msg || "Save failed");
        }
      }

      
      await loadMarks();
      clearForm();
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  });

 function updateTotal() {
    const english = +document.getElementById("english").value || 0;
    const tamil = +document.getElementById("tamil").value || 0;
    const maths = +document.getElementById("maths").value || 0;
    const science = +document.getElementById("science").value || 0;
    const social = +document.getElementById("social").value || 0;
    document.getElementById("total").value = english + tamil + maths + science + social;
  }

  
  ["english","tamil","maths","science","social"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateTotal);
  });

  marksTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("edit")) {
      const tr = target.closest("tr");
      editingId = tr.dataset.id;
      // set selected student by dataset
      if (tr.dataset.studentId) studentSelect.value = tr.dataset.studentId;
      document.getElementById("english").value = tr.querySelector(".cell-english").textContent || "";
      document.getElementById("tamil").value = tr.querySelector(".cell-tamil").textContent || "";
      document.getElementById("maths").value = tr.querySelector(".cell-maths").textContent || "";
      document.getElementById("science").value = tr.querySelector(".cell-science").textContent || "";
      document.getElementById("social").value = tr.querySelector(".cell-social").textContent || "";
      document.getElementById("total").value = tr.querySelector(".cell-total").textContent || "";
      saveBtn.textContent = "Update Marks";
      
      return;
    }

    if (target.classList.contains("delete")) {
      if (!confirm("Delete this marksheet?")) return;
      const id = target.dataset.id;
      const res = await fetch(`${API_BASE}/${id}?token=${token}`, { method: "DELETE", headers: { "Content-Type": "application/json" }});
      if (!res.ok) return alert("Delete failed");
      await loadMarks();
    }
  });

  function clearForm() {
    studentSelect.value = "";
    document.getElementById("english").value = "";
    document.getElementById("tamil").value = "";
    document.getElementById("maths").value = "";
    document.getElementById("science").value = "";
    document.getElementById("social").value = "";
    document.getElementById("total").value = "";
    editingId = null;
    saveBtn.textContent = "Save Marks";
  }


  await loadStudents();
  await loadMarks();

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });
});
