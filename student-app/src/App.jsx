import { useState, useEffect } from "react";

const API = "http://localhost:8080/students";

const initialForm = { name: "", email: "", course: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(""), 3000); return () => clearTimeout(t); }
  }, [success]);

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(""), 4000); return () => clearTimeout(t); }
  }, [error]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch");
      setStudents(await res.json());
    } catch { setError("Could not load students. Is the server running?"); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.course.trim()) {
      setError("All fields are required."); return;
    }
    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(editId ? "Student updated successfully." : "Student added successfully.");
      setForm(initialForm); setEditId(null);
      fetchStudents();
    } catch { setError("Something went wrong. Please try again."); }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSuccess("Student deleted."); setDeleteConfirm(null);
      fetchStudents();
    } catch { setError("Delete failed."); }
  }

  function handleEdit(s) {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, course: s.course });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() { setEditId(null); setForm(initialForm); }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <span style={styles.logoMark}>S</span>
            <span style={styles.logoText}>StudentHub</span>
          </div>
          <span style={styles.headerSub}>{students.length} enrolled</span>
        </div>
      </header>

      <main style={styles.main}>
        {/* Toast notifications */}
        {success && <div style={{ ...styles.toast, ...styles.toastSuccess }}>{success}</div>}
        {error   && <div style={{ ...styles.toast, ...styles.toastError }}>{error}</div>}

        {/* Form */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>{editId ? "Edit Student" : "Add New Student"}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Alice Johnson"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="e.g. alice@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Course</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Computer Science"
                  value={form.course}
                  onChange={e => setForm({ ...form, course: e.target.value })}
                />
              </div>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.btnPrimary}>
                {editId ? "Update Student" : "Add Student"}
              </button>
              {editId && (
                <button type="button" onClick={handleCancel} style={styles.btnSecondary}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Table */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>All Students</h2>
          {loading ? (
            <div style={styles.empty}>Loading...</div>
          ) : students.length === 0 ? (
            <div style={styles.empty}>No students found. Add one above.</div>
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {["ID", "Name", "Email", "Course", "Actions"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}><span style={styles.idBadge}>#{s.id}</span></td>
                      <td style={styles.td}><strong>{s.name}</strong></td>
                      <td style={styles.td}><span style={styles.email}>{s.email}</span></td>
                      <td style={styles.td}><span style={styles.courseBadge}>{s.course}</span></td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button onClick={() => handleEdit(s)} style={styles.btnEdit}>Edit</button>
                          <button onClick={() => setDeleteConfirm(s.id)} style={styles.btnDelete}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete Student?</h3>
            <p style={styles.modalText}>This action cannot be undone.</p>
            <div style={styles.modalActions}>
              <button onClick={() => handleDelete(deleteConfirm)} style={styles.btnPrimary}>Yes, Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={styles.btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f7f7f5",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #e8e8e4",
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 900,
    margin: "0 auto",
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    width: 32, height: 32,
    background: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16,
  },
  logoText: { fontWeight: 600, fontSize: 17, color: "#1a1a1a", letterSpacing: "-0.3px" },
  headerSub: { fontSize: 13, color: "#888" },

  main: { maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 24 },

  toast: {
    padding: "12px 18px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    animation: "fadeIn 0.2s ease",
  },
  toastSuccess: { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" },
  toastError:   { background: "#fdecea", color: "#c62828", border: "1px solid #ffcdd2" },

  card: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e8e8e4",
    padding: "28px 28px",
  },
  cardTitle: { fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 20px", letterSpacing: "-0.2px" },

  form: {},
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 500, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    padding: "10px 14px",
    border: "1px solid #e0e0dc",
    borderRadius: 8,
    fontSize: 14,
    color: "#1a1a1a",
    background: "#fafaf8",
    outline: "none",
    transition: "border-color 0.15s",
  },
  formActions: { display: "flex", gap: 10 },

  btnPrimary: {
    padding: "10px 22px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "-0.1px",
  },
  btnSecondary: {
    padding: "10px 22px",
    background: "#fff",
    color: "#555",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },

  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    fontSize: 11,
    fontWeight: 600,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    borderBottom: "1px solid #e8e8e4",
    background: "#fafaf8",
  },
  td: { padding: "13px 14px", borderBottom: "1px solid #f0f0ec", verticalAlign: "middle" },
  trEven: { background: "#fff" },
  trOdd:  { background: "#fafaf8" },

  idBadge: { fontSize: 12, color: "#aaa", fontFamily: "monospace" },
  email:   { color: "#555", fontSize: 13 },
  courseBadge: {
    display: "inline-block",
    padding: "3px 10px",
    background: "#f0f0ec",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    color: "#444",
  },
  actions: { display: "flex", gap: 8 },
  btnEdit: {
    padding: "6px 14px",
    background: "#fff",
    color: "#1a1a1a",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  btnDelete: {
    padding: "6px 14px",
    background: "#fff",
    color: "#c62828",
    border: "1px solid #ffcdd2",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },

  empty: { textAlign: "center", color: "#aaa", padding: "40px 0", fontSize: 14 },

  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    padding: "32px 28px",
    width: 360,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  modalTitle: { fontSize: 17, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" },
  modalText:  { fontSize: 14, color: "#777", margin: "0 0 24px" },
  modalActions: { display: "flex", gap: 10 },
};