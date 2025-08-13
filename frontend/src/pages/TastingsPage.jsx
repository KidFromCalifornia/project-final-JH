import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TastingsPage = () => {
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch public tastings from backend
    fetch(`${API_URL}/tastings/public`)
      .then((res) => res.json())
      .then((data) => {
        setTastings(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
