import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const CafePage = () => {
  const { cafeId } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cafeId) return;
    setLoading(true);
    fetch(`${API_URL}/cafes/${cafeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cafe");
        return res.json();
      })
      .then((data) => {
        setCafe(data.data); // Use .data because your backend wraps the cafe in a data property
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [cafeId]);

  if (loading) return <div>Loading cafe...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cafe) return <div>No cafe found.</div>;

  return (
    <div>
      <h2>{cafe.name}</h2>
      <p>{cafe.address}</p>
      <p>{cafe.description}</p>
      <p>{cafe.features?.join(", ")}</p>
    </div>
  );
};

export default CafePage;
