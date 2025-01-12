import React, { useState, useEffect } from "react";
import { GetFutureEvents, getAttendingEvents, deleteEventAttendance } from "../apiservice/ApiUserDashboardservice";
import { logout } from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";


export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);  // For upcoming events
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);  // Ensure this is an array

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
      const response = await getAttendingEvents();  // Fetch attending events from API

      if (Array.isArray(response)) {
        setAttendingEvents(response);  // Ensure it is an array before setting state
      } else {
        console.error("Error: Expected an array of attending events, but got:", response);
      }
    } catch (error) {
      console.error("Error fetching attending events:", error);
    }
  };

  useEffect(() => {
    ShowFutureEvents();
    fetchAttendingEvents();  // Fetch the user's attending events when the component loads
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

  const handleDeleteEventAttendance = async (eventId: number) => {
    try {
      const response = await deleteEventAttendance(eventId);  // Remove attendance
      setAttendingEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));  // Update the attending events list
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
              <strong>{event.title}</strong> - {event.eventDate}
              <button onClick={() => handleEventClick(event.eventId)}
                   style={{
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  padding: "3px 5px",
                  cursor: "pointer",
                  marginLeft: "10px",
                  }}>View Details</button>
            </li>
          ))}
        </ul>
      )}

      <h4>My upcoming events</h4>
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
                <button onClick={() => handleDeleteEventAttendance(event.eventId)}
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
    </div>
  );
};
