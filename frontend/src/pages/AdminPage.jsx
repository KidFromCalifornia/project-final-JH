import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const AdminPage = () => {
  const [cafes, setCafes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin status from localStorage
  const isAdmin =
    typeof window !== "undefined" &&
    window.localStorage &&
    localStorage.getItem("admin") === "true";

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      fetch(`${API_URL}/cafes`).then((res) => res.json()),
      fetch(`${API_URL}/cafeSubmissions`).then((res) => res.json()),
      fetch(`${API_URL}/tastings/public`).then((res) => res.json()),
    ]).then(([cafesRes, submissionsRes, tastingsRes]) => {
      setCafes(cafesRes.data || []);
      setSubmissions(submissionsRes.data || []);
      setTastings(tastingsRes.data || []);
      setLoading(false);
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }
  if (loading) return <div>Loading Approval data...</div>;

  const handleEditCafe = (cafeId) => {
    // Implement edit cafe logic
  };

  const handleDeleteCafe = (cafeId) => {
    // Implement delete cafe logic
  };

  const handleApproveSubmission = (submissionId) => {
    // Implement approve submission logic
  };
  const handleEditSubmission = (submissionId) => {
    // Implement edit submission logic
  };
  const handleDeleteSubmission = (submissionId) => {
    // Implement delete submission logic
  };

  const handleDeleteTasting = (tastingId) => {
    // Implement delete tasting logic
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Edit Cafes</h3>
        {cafes.map((cafe) => (
          <div key={cafe._id}>
            <strong>{cafe.name}</strong>
            <p>{cafe.address}</p>
            <p>{cafe.description}</p>
            <p>{cafe.features?.join(", ")}</p>
            <button onClick={() => handleEditCafe(cafe._id)}>Edit</button>
            <button onClick={() => handleDeleteCafe(cafe._id)}>Delete</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Approve/Edit Cafe Submissions</h3>
        {submissions.map((sub) => (
          <div key={sub._id}>
            <strong>{sub.name}</strong>
            <button onClick={() => handleApproveSubmission(sub._id)}>
              Approve
            </button>
            <button onClick={() => handleEditSubmission(sub._id)}>Edit</button>
            <button onClick={() => handleDeleteSubmission(sub._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>
      <section>
        <h3>Delete Tasting Notes</h3>
        {tastings.map((tasting) => (
          <div key={tasting._id}>
            <strong>{tasting.cafeName}</strong> - {tasting.note}
            <button onClick={() => handleDeleteTasting(tasting._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminPage;
