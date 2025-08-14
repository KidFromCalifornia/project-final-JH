import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const MapPage = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/cafes`)
      .then((res) => res.json())
      .then((data) => {
        setCafes(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group cafes by category
  const grouped = cafes.reduce((acc, cafe) => {
    const cat = cafe.category || "Other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(cafe);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading cafes...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "1rem" }}>
      <h2>Stockholm Cafes by Category</h2>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(grouped).map(([category, cafes]) => (
          <div key={category} style={{ flex: "1 1 250px", minWidth: 250 }}>
            <h3>{category}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[...cafes]
                .sort((a, b) => {
                  const hoodA = a.locations?.[0]?.neighborhood || "Unavailable";
                  const hoodB = b.locations?.[0]?.neighborhood || "Unavailable";
                  return hoodA.localeCompare(hoodB);
                })
                .map((cafe) => (
                  <li
                    key={cafe._id}
                    style={{
                      marginBottom: "1rem",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <strong>{cafe.name}</strong>
                    <br />
                    <span>{cafe.address}</span>
                    <br />
                    <span>
                      <b>Neighborhood:</b>{" "}
                      {cafe.locations?.[0]?.neighborhood === "*" ||
                      !cafe.locations?.[0]?.neighborhood
                        ? "Unavailable"
                        : cafe.locations?.[0]?.neighborhood}
                    </span>
                    <br />
                    <span>{cafe.description}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
