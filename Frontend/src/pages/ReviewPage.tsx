import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventReviews, addEventReview } from "../apiservice/ApiUserDashboardservice";

const ReviewPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, feedback: "" });

  // Fetch reviews for the event
  useEffect(() => {
    const fetchReviews = async () => {
      if (!eventId) return;
      try {
        const response = await getEventReviews(Number(eventId));
        setReviews(response);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [eventId]);

  // Add a new review
  const handleAddReview = async () => {
    if (!eventId) return;

    const review = {
      rating: newReview.rating,
      feedback: newReview.feedback,
    };

    try {
      const response = await addEventReview(Number(eventId), review);
      if (response.success) {
        setReviews((prev) => [...prev, review]);
        setNewReview({ rating: 0, feedback: "" });
      } else {
        alert("Failed to add review.");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div>
      <h1>Reviews for Event {eventId}</h1>

      <div>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <strong>Rating:</strong> {review.rating} <br />
                <strong>Feedback:</strong> {review.feedback}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Add a Review</h2>
      <input
        type="number"
        placeholder="Rating (1-5)"
        min="1"
        max="5"
        value={newReview.rating}
        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
      />
      <textarea
        placeholder="Your feedback"
        value={newReview.feedback}
        onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}
      />
      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  );
};

export default ReviewPage;
