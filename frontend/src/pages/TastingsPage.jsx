import TastingForm from "../components/TastingForm";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TastingsPage = () => {
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = true; // Change this to true when logged in

  useEffect(() => {
    fetch(`${API_URL}/tastings/public`)
      .then((res) => res.json())
      .then((data) => {
        setTastings(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleTastingSubmit = (formData) => {
    post(`${API_URL}/tastings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTastings((prev) => [data.data, ...prev]);
        } else {
          console.error("Failed to submit tasting:", data.error);
        }
      })
      .catch((error) => console.error("Error submitting tasting:", error));

    // Reset form or show success message
    setTastings((prev) => []);

    console.log("Submitted tasting:", formData);
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
      <h2> Whatcha Drinking?</h2>
      {/* Show form or message */}
      {isLoggedIn ? (
        <TastingForm onSubmit={handleTastingSubmit} />
      ) : (
        <div style={{ margin: "2rem 0", fontWeight: "bold" }}>
          Please log in to add your own experience
        </div>
      )}
      {/* Tastings list */}
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TastingsPage;
