import React, { useState, useEffect } from "react";
import { 
  GetFutureEvents, 
  getAttendingEvents, 
  deleteAttendance, 
  getEventReviews, 
  addEventReview 
} from "../apiservice/ApiUserDashboardservice"; // Zorg ervoor dat de API-methoden bestaan
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";


export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]); // Voor het opslaan van beoordelingen
  const [newReview, setNewReview] = useState({ rating: 0, feedback: "" }); // Voor het nieuwe review
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // Actieve event voor reviews

  // Fetch upcoming events
  const ShowFutureEvents = async () => {
    try {
      const response = await GetFutureEvents();
      setEvents(response);
    } catch (error) {
      console.error("Error fetching future events:", error);
    }
  };
  

  // Fetch events the user is attending
  const fetchAttendingEvents = async () => {
    try {
      const response = await getAttendingEvents();
      if (Array.isArray(response)) {
        setAttendingEvents(response);
      } else {
        console.error("Error: Expected an array of attending events, but got:", response);
      }
    } catch (error) {
      console.error("Error fetching attending events:", error);
    }
  };

  // Fetch reviews for the selected event
  const fetchReviews = async (eventId: number) => {
    try {
      const response = await getEventReviews(eventId);
      setReviews(response);
      setSelectedEventId(eventId); // Stel het actieve event in
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Add a new review
const handleAddReview = async () => {
  if (!selectedEventId) return;

  // Alleen de rating versturen
  const review = {
    rating: newReview.rating,
    // Geen feedback meer
  };

  try {
    const response = await addEventReview(selectedEventId, review);  // Verstuur de beoordeling
    if (response.success) {
      fetchReviews(selectedEventId); // Reviews vernieuwen
      // setNewReview({ rating: 0 });  // Reset alleen de rating
    } else {
      alert("Failed to add review.");
    }
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

  

  useEffect(() => {
    ShowFutureEvents();
    fetchAttendingEvents();
  }, []);

  const handleEventClick = (eventId: number) => {
    navigate(`/eventdetails/${eventId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeleteAttendance = async (eventId: number) => {
    try {
      await deleteAttendance(eventId);
      setAttendingEvents((prev) => prev.filter((event) => event.eventId !== eventId));
      alert("Attendance removed successfully.");
    } catch (error) {
      console.error("Error removing attendance:", error);
    }
  };

  return (
    <div>
      <h3>Welcome to your Dashboard</h3>
      <button onClick={handleLogout}>Log out</button>

      <h4>All Upcoming Events</h4>
      {events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li
            key={event.eventId}
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
            }}>
              <strong>{event.title}</strong> - {event.eventDate}-
              <span>Average Rating: {event.averageRating}</span> {/* Gemiddelde beoordeling tonen */}
              <button onClick={() => handleEventClick(event.eventId)}>View Details</button>
              <button onClick={() => navigate(`/review/${event.eventId}`)}>Place Review</button>

            </li>
          ))}
        </ul>
      )}

      <h4>My Upcoming Events</h4>
      {attendingEvents.length === 0 ? (
        <p>You are not attending any events.</p>
      ) : (
        <ul>
          {attendingEvents.map((event) => (
            <li key={event.eventId}
            style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
            }}>
              <strong>{event.title}</strong> - {event.eventDate}
                <button onClick={() => handleDeleteAttendance(event.eventId)}
                   style={{
                  backgroundColor: "darkred",
                  color: "white",
                  border: "none",
                  padding: "3px 5px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  }}>Remove Attendance</button>
            </li>
          ))}
        </ul>
      )}

      {selectedEventId && (
        <div>
          <h4>Reviews for Event {selectedEventId}</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet for this event.</p>
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id}>
                  <strong>Rating:</strong> {review.rating} - {review.feedback}
                </li>
              ))}
            </ul>
          )}
          <div>
            <h5>Add a Review</h5>
            <input
              type="number"
              placeholder="Rating (1-5)"
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
        </div>
      )}
    </div>
  );
};
