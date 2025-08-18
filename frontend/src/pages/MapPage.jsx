import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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
    <>
      <h2>Stockholm's Coffee Club</h2>
      <div style={{ height: "400px", width: "100%", marginBottom: "2rem" }}>
        <MapContainer
          center={[59.3293, 18.0686]}
          zoom={12}
          style={{ height: "400px", width: "100%", marginBottom: "2rem" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cafes.map((cafe) => {
            const coords = cafe.locations?.[0]?.coordinates?.coordinates;
            // Fix: Only render marker if coordinates are valid numbers
            if (
              coords &&
              coords.length === 2 &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number" &&
              coords[0] !== 0 &&
              coords[1] !== 0
            ) {
              // Leaflet expects [lat, lng], but your data is [lng, lat]
              return (
                <Marker key={cafe._id} position={[coords[1], coords[0]]}>
                  <Popup>
                    <strong>{cafe.name}</strong>
                    <br />
                    {cafe.locations?.[0]?.address}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
      <div>
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
                    <strong>
                      <Link
                        style={{ color: "#170351", textDecoration: "none" }}
                        to={`/cafes/${cafe._id}`}
                      >
                        {cafe.name}
                      </Link>
                    </strong>
                    <br />
                    <span>{cafe.locations?.[0]?.address}</span>
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
    </>
  );
};

export default MapPage;
