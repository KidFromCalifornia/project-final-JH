import TastingForm from "../components/TastingForm";
import { useEffect } from "react";
import { useCafeStore } from "../useCafeStore";
import { SwalAlertStyles } from "../components/SwalAlertStyles";
import { tastingAPI } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TastingsPage = () => {
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);
  const editingTasting = useCafeStore((state) => state.editingTasting);
  const setEditingTasting = useCafeStore((state) => state.setEditingTasting);
  const deletingTasting = useCafeStore((state) => state.deletingTasting);
  const setDeletingTasting = useCafeStore((state) => state.setDeletingTasting);
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const currentPage = useCafeStore((state) => state.currentPage);
  const setCurrentPage = useCafeStore((state) => state.setCurrentPage);
  const tastingsPerPage = useCafeStore((state) => state.tastingsPerPage);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchTastings = async () => {
      setLoading(true);
      try {
        let allTastings = [];
        if (isLoggedIn) {
          const userTastings = await tastingAPI.getUserTastings();
          allTastings = userTastings.data || [];
        } else {
          const publicTastings = await tastingAPI.getPublic();
          allTastings = publicTastings.data || [];
        }
        setTastings(allTastings);
      } catch {
        setTastings([]);
      }
      setLoading(false);
    };
    fetchTastings();
  }, [isLoggedIn, setTastings, setLoading]);

  useEffect(() => {
    const deleteTasting = async () => {
      if (!deletingTasting) return;
      try {
        const result = await tastingAPI.delete(deletingTasting._id);
        if (result.success) {
          setTastings((prev) =>
            prev.filter((t) => t._id !== deletingTasting._id)
          );
        } else {
          setTastings((prev) => [
            ...prev,
            { _id: "error", error: result.error },
          ]);
        }
      } catch (error) {
        setTastings((prev) => [
          ...prev,
          { _id: "error", error: error.message },
        ]);
      }
      setDeletingTasting(null);
    };
    deleteTasting();
  }, [deletingTasting, setTastings, setDeletingTasting]);

  const handleTastingSubmit = async (formData) => {
    try {
      let result;
      if (editingTasting) {
        result = await tastingAPI.update(editingTasting._id, formData);
      } else {
        result = await tastingAPI.create(formData);
      }
      if (result.success) {
        if (editingTasting) {
          setTastings((prev) =>
            prev.map((t) => (t._id === editingTasting._id ? result.data : t))
          );
          setEditingTasting(null);
        } else {
          setTastings((prev) => [result.data, ...prev]);
        }
      } else {
        setTastings((prev) => [...prev, { _id: "error", error: result.error }]);
      }
    } catch (error) {
      setTastings((prev) => [...prev, { _id: "error", error: error.message }]);
    }
  };

  const normalize = (str) =>
    String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredTastings = tastings.filter((tasting) => {
    if (!tasting) return false;
    const query = normalize(searchQuery);

    // Flatten all tasting fields into a single string for searching
    const allFields = Object.values(tasting)
      .map((value) => {
        if (typeof value === "object" && value !== null) {
          // For nested objects, include their values too
          return Object.values(value).map(normalize).join(" ");
        }
        return normalize(value);
      })
      .join(" ");

    return allFields.includes(query);
  });

  // Pagination logic
  const indexOfLastTasting = currentPage * tastingsPerPage;
  const indexOfFirstTasting = indexOfLastTasting - tastingsPerPage;
  const currentTastings = filteredTastings.slice(
    indexOfFirstTasting,
    indexOfLastTasting
  );

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
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tastings by coffee, cafe, or notes..."
        style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
      />
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
      {filteredTastings.length === 0 ? (
        <SwalAlertStyles message="Nothing to see here 😞" type="info" />
      ) : (
        <>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {currentTastings.map((tasting) =>
              tasting.error ? (
                <SwalAlertStyles
                  key={tasting._id}
                  message={tasting.error}
                  type="error"
                />
              ) : (
                <li
                  key={tasting._id}
                  style={{
                    flex: "1 1 250px",
                    marginBottom: "1.5rem",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "1rem",
                  }}
                >
                  <h3>{tasting.coffeeName}</h3> at
                  <br />
                  at <em>{tasting.cafeId?.name}</em>
                  <span>
                    <b>Neighborhood:</b> {tasting.cafeNeighborhood}
                  </span>
                  <br />
                  <span>
                    <b>Roaster:</b> {tasting.coffeeRoaster}
                  </span>
                  <br />
                  <span>
                    <b>Origin:</b> {tasting.coffeeOrigin}
                  </span>
                  <br />
                  <span>
                    <b>Region:</b> {tasting.coffeeOriginRegion}
                  </span>
                  <br />
                  <span>
                    <b>Brew Method:</b> {tasting.brewMethod}
                  </span>
                  <br />
                  <span>
                    <b>Roast Level:</b> {tasting.roastLevel}
                  </span>
                  <br />
                  <span>
                    <b>Tasting Notes:</b>{" "}
                    {Array.isArray(tasting.tastingNotes)
                      ? tasting.tastingNotes.join(", ")
                      : tasting.tastingNotes}
                  </span>
                  <br />
                  <span>
                    <b>Acidity:</b> {tasting.acidity}
                  </span>
                  <br />
                  <span>
                    <b>Mouth Feel:</b> {tasting.mouthFeel}
                  </span>
                  <br />
                  <span>
                    <b>Rating:</b> {tasting.rating}/5
                  </span>
                  <br />
                  <span>
                    <b>Notes:</b> {tasting.notes}
                  </span>
                  <br />
                  <span>
                    <b>Public:</b> {tasting.isPublic ? "Yes" : "No"}
                  </span>
                  <br />
                  <span style={{ color: "#888", fontSize: "0.9rem" }}>
                    {tasting.userId?.username} •{" "}
                    {new Date(tasting.createdAt).toLocaleDateString()}
                  </span>
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
              )
            )}
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ marginRight: "1rem" }}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredTastings.length / tastingsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredTastings.length / tastingsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage ===
                  Math.ceil(filteredTastings.length / tastingsPerPage) ||
                filteredTastings.length === 0
              }
              style={{ marginLeft: "1rem" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TastingsPage;
