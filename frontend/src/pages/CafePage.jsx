import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cafeAPI } from "../services/api";
import { useCafeStore } from "../useCafeStore";
import { SwalAlertStyles } from "../components/SwalAlertStyles";

const CafePage = () => {
  const { cafeId } = useParams();
  const [cafe, setCafe] = useState(null);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cafeId) return;
    setLoading(true);
    cafeAPI
      .getById(cafeId)
      .then((data) => {
        setCafe(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch cafe");
        setLoading(false);
      });
  }, [cafeId, setLoading]);

  if (loading) return <div>Loading cafe...</div>;
  if (error) return <SwalAlertStyles message={error} type="error" />;
  if (!cafe) return <SwalAlertStyles message="No cafe found." type="info" />;

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
