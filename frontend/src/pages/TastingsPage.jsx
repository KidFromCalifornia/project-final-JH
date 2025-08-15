import TastingForm from "../components/TastingForm";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TastingsPage = () => {
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTasting, setEditingTasting] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));
  const [deletingTasting, setDeletingTasting] = useState(null);

  // Handle deletion of a tasting
  useEffect(() => {
    const deleteTasting = async () => {
      if (!deletingTasting) return;

      const res = await fetch(`${API_URL}/tastings/${deletingTasting.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setTastings((prev) => prev.filter((t) => t._id !== deletingTasting.id));
      } else {
        console.error("Failed to delete tasting:", data.error);
      }
      setDeletingTasting(null);
    };

    deleteTasting();
  }, [deletingTasting]);

  useEffect(() => {
    const fetchTastings = async () => {
      setLoading(true);
      try {
        // Fetch all public tastings
        const publicRes = await fetch(`${API_URL}/tastings/public`);
        const publicData = await publicRes.json();
        const publicTastings = publicData.data || [];

        let allTastings = publicTastings;

        // If logged in, fetch user's tastings (private + public)
        if (isLoggedIn) {
          const userRes = await fetch(`${API_URL}/tastings`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          });
          const userData = await userRes.json();
          const userTastings = userData.data || [];
          // Replace public tastings with user's own if they overlap
          const userIds = new Set(userTastings.map((t) => t._id));
          allTastings = [
            ...userTastings,
            ...publicTastings.filter((t) => !userIds.has(t._id)),
          ];
        }

        setTastings(allTastings);
      } catch {
        setTastings([]);
      }
      setLoading(false);
    };

    fetchTastings();
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
      <h2>Coffee Tastings</h2>

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
              {/* DEBUG INFO: Remove after troubleshooting */}
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#c00",
                  margin: "0.5rem 0",
                }}
              >
                <div>tasting.userId?._id: {String(tasting.userId?._id)}</div>
                <div>
                  localStorage userId: {String(localStorage.getItem("userId"))}
                </div>
                <div>isLoggedIn: {String(isLoggedIn)}</div>
                <div>
                  Comparison:{" "}
                  {String(tasting.userId?._id) ===
                  String(localStorage.getItem("userId"))
                    ? "MATCH"
                    : "NO MATCH"}
                </div>
              </div>
              <div
                hidden={
                  !isLoggedIn ||
                  String(tasting.userId?._id) !==
                    String(localStorage.getItem("userId"))
                }
                style={{
                  marginTop: "0.5rem",
                  color: "#007bff",
                  cursor: "pointer",
                }}
                onClick={() => setEditingTasting(tasting)}
              >
                <button
                  style={{ marginTop: "0.5rem" }}
                  onClick={() => setDeletingTasting(tasting)}
                >
                  Delete
                </button>
                <button
                  style={{ marginTop: "0.5rem" }}
                  onClick={() => setEditingTasting(tasting)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TastingsPage;
