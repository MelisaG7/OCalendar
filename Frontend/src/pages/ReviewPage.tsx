import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addEventReview } from "../apiservice/ApiUserDashboardservice";

const ReviewPage: React.FC = () => {
  const { eventId } = useParams(); // Haal eventId uit de URL
  const numericEventId = parseInt(eventId || "", 10); // Zet eventId om naar een getal

  const navigate = useNavigate();
  const [rating, setRating] = useState(0); // Beoordeling (ster)

  // Functie om de beoordeling in te dienen
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!numericEventId) return;

    const review = {
      rating,
      // Geen feedback meer
    };

    try {
      await addEventReview(numericEventId, review); // Voeg de beoordeling toe
      alert("Review added successfully!");
      navigate(`/dashboard`); // Verander dit naar het dashboard voor de gebruiker
    } catch (error) {
      console.error("Error adding review!:", error);
      alert("Error adding review!");
    }
  };

  return (
    <div>
      <h3>Place Review for Event</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating (1 to 5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewPage;
