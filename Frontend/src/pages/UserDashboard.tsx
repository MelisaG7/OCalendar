import React, { useState, useEffect } from "react";

import {
  GetFutureEvents,
  getAttendingEvents,
  getAttendances,
  deleteEventAttendance,
  createOfficeAttendance,
  updateOfficeAttendance,
  deleteOfficeAttendance, // Import the deleteOfficeAttendance function
  getEventReviews, 
  addEventReview 
} from "../apiservice/ApiUserDashboardservice";

import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);

  const [attendances, setAttendances] = useState<any[]>([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<any[]>([]); // Voor het opslaan van beoordelingen
  const [newReview, setNewReview] = useState({ rating: 0, feedback: "" }); // Voor het nieuwe review
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null); // Actieve event voor reviews


  // Fetch future events
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
        console.error("Expected an array of attending events but got:", response);
      }
    } catch (error) {
      console.error("Error fetching attending events:", error);
    }
  };


  // Fetch all office attendances
  const fetchAttendances = async () => {
    try {
      const response = await getAttendances();
      setAttendances(response);
    } catch (error) {
      setError("There are no office attendances.");
    }
  };

  // Create office attendance
  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

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

    try {
      await createOfficeAttendance(attendanceDate);
      setMessage("Attendance created successfully!");
      setAttendanceDate("");
      fetchAttendances(); // Refresh the attendance list
    } catch (err) {
      setError("Error creating attendance. Please try again.");
    }
  };

  // Update office attendance
  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttendance) return;

    try {
      await updateOfficeAttendance(selectedAttendance, attendanceDate);
      setMessage("Attendance updated successfully!");
      setAttendanceDate("");
      setSelectedAttendance(null);
      fetchAttendances(); // Refresh the attendance list
    } catch (err) {
      setError("Failed to update attendance.");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Remove event attendance
  const handleDeleteEventAttendance = async (eventId: number) => {
    try {
      await deleteEventAttendance(eventId);
      setAttendingEvents((prevEvents) =>
        prevEvents.filter((event) => event.eventId !== eventId)
      );
      await deleteAttendance(eventId);
      setAttendingEvents((prev) => prev.filter((event) => event.eventId !== eventId));

      alert("Attendance removed successfully.");
    } catch (error) {
      console.error("Error removing attendance:", error);
    }
  };

  
  const handleDeleteAttendance = async (attendanceId: number) => {
    console.log("Attempting to delete attendance with ID:", attendanceId); 
    try {
      const response = await deleteOfficeAttendance(attendanceId);
      console.log("Delete response:", response); 

      // After deleting the attendance, refresh the list of attendances
      setAttendances((prevAttendances) =>
        prevAttendances.filter((attendance) => attendance.attendanceId !== attendanceId)
      );
      alert("Attendance deleted successfully.");
    } catch (error) {
      console.error("Error deleting attendance:", error);
      setError("Error deleting attendance. Please try again.");
    }
  };

  
  useEffect(() => {
    ShowFutureEvents();
    fetchAttendingEvents();
    fetchAttendances();
  }, []);

  return (
    <div>
      <h3>Welcome to your Dashboard</h3>
      <button onClick={handleLogout}>Log out</button>

      {/* Upcoming Events */}
      <h4>All Upcoming Events</h4>
      {events.length === 0 ? (
        <p>No upcoming events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.eventId} style={{ ...listItemStyles }}>
              <strong>{event.title}</strong> - {event.eventDate}
              <button onClick={() => navigate(`/eventdetails/${event.eventId}`)} style={detailsButtonStyles}>
                View Details
              </button>
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

      {/* My Upcoming Events */}
      <h4>My Upcoming Events</h4>
      {attendingEvents.length === 0 ? (
        <p>You are not attending any events.</p>
      ) : (
        <ul>
          {attendingEvents.map((event) => (
            <li key={event.eventId} style={{ ...listItemStyles }}>
              <strong>{event.title}</strong> - {event.eventDate}
              <button onClick={() => handleDeleteEventAttendance(event.eventId)} style={removeButtonStyles}>
                Remove Attendance
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* My Office Attendances */}
      <h4>My Office Attendances</h4>
      {attendances.length === 0 ? (
        <p>No office attendances found.</p>
      ) : (
        <ul>
          {attendances.map((attendance) => (
            <li key={attendance.attendanceId} style={{ ...listItemStyles }}>
              <strong>Date (year-month-day):</strong> {attendance.attendanceDate}
              <button
                onClick={() => handleDeleteAttendance(attendance.attendanceId)}
                style={removeButtonStyles}
              >
                Delete Attendance
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Create Office Attendance */}
      <h4>Manage Office Attendance</h4>
      <form onSubmit={handleCreateAttendance}>
        <div>
          <label htmlFor="attendanceDate">Attendance Date:</label>
          <input
            type="date"
            id="attendanceDate"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Attendance</button>
      </form>

      {/* Update Office Attendance */}
      <h4>Update Office Attendance</h4>
      <form onSubmit={handleUpdateAttendance}>
        <div>
          <label htmlFor="attendanceSelect">Select Attendance to Update:</label>
          <select
            id="attendanceSelect"
            onChange={(e) => setSelectedAttendance(Number(e.target.value))}
            value={selectedAttendance || ""}
            required
          >
            <option value="">-- Select Attendance --</option>
            {attendances.map((attendance) => (
              <option key={attendance.attendanceId} value={attendance.attendanceId}>
                {attendance.attendanceDate}
              </option>
            ))}
          </select>
        </div>

        {selectedAttendance && (
          <div>
            <label htmlFor="newDate">New Attendance Date:</label>
            <input
              type="date"
              id="newDate"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">Update Attendance</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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

// Styles
const listItemStyles = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
};

const detailsButtonStyles = {
  backgroundColor: "blue",
  color: "white",
  border: "none",
  padding: "3px 5px",
  cursor: "pointer",
  marginLeft: "10px",
};

const removeButtonStyles = {
  backgroundColor: "darkred",
  color: "white",
  border: "none",
  padding: "3px 5px",
  cursor: "pointer",
  marginLeft: "10px",
};
