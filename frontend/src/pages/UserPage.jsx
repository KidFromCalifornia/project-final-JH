import TastingForm from "../components/TastingForm";

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const UserPage = () => {
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTasting, setEditingTasting] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [isLoggedIn] = useState(!!localStorage.getItem("userToken"));
  // Get username from localStorage if available
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (isLoggedIn) {
        const res = await fetch(`${API_URL}/cafeSubmissions/my-submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await res.json();
        setUserSubmissions(data.data || []);
      } else {
        setUserSubmissions([]);
      }
    };

    fetchUserSubmissions();
  }, [isLoggedIn]);

  const handleTastingSubmit = (formData) => {
    const method = editingTasting ? "PUT" : "POST";
    const url = editingTasting
      ? `${API_URL}/tastings/${editingTasting._id}`
      : `${API_URL}/tastings`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (editingTasting) {
            setTastings((prev) =>
              prev.map((t) => (t._id === editingTasting._id ? data.data : t))
            );
            setEditingTasting(null);
          } else {
            setTastings((prev) => [data.data, ...prev]);
          }
        } else {
          console.error("Failed to submit tasting:", data.error);
        }
      })
      .catch((error) => console.error("Error submitting tasting:", error));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading tastings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h2>{username ? `${username}'s Page` : "User Page"}</h2>
      <h3>Your Cafe Submissions</h3>
      {userSubmissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {userSubmissions.map((sub) => (
            <li key={sub._id} style={{ marginBottom: "1rem" }}>
              <strong>{sub.name}</strong>
              <br />
              <span>{sub.description}</span>
              <br />
              <span style={{ color: "#888", fontSize: "0.9rem" }}>
                {sub.category} — {sub.isApproved ? "Approved" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3>Whatcha Drinking?</h3>

      {isLoggedIn ? (
        <TastingForm
          onSubmit={handleTastingSubmit}
          initialValues={editingTasting || {}}
        />
      ) : (
        <div style={{ margin: "2rem 0", fontWeight: "bold" }}>
          Please log in to add your own experience
        </div>
      )}

      {tastings.length === 0 ? (
        <p>Nothing to see here 😞</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tastings.map((tasting) => (
            <li
              key={tasting._id}
              style={{
                marginBottom: "1.5rem",
                borderBottom: "1px solid #eee",
                paddingBottom: "1rem",
              }}
            >
              <strong>{tasting.coffeeName}</strong> at{" "}
              <em>{tasting.cafeId?.name}</em>
              <br />
              <span>Rating: {tasting.rating}/5</span>
              <br />
              <span>{tasting.notes}</span>
              <br />
              <span style={{ color: "#888", fontSize: "0.9rem" }}>
                {tasting.userId?.username} •{" "}
                {new Date(tasting.createdAt).toLocaleDateString()}
              </span>
              <button
                style={{ marginTop: "0.5rem" }}
                onClick={() => setEditingTasting(tasting)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPage;
