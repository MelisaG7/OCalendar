import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAttendance, deleteAttendance } from "../apiservice/ApiUserDashboardservice";


export const AttendEventForm: React.FC = () => {
  // Use useParams to extract eventId from URL
  const { eventId } = useParams<{ eventId: string }>();
  const [isAttending, setIsAttending] = useState(false);

  // Function to handle attending the event
  const handleAttend = async () => {
    if (eventId) {
      try {
        console.log(`Attending event with ID: ${eventId}`);
        // Call the API to register attendance
        const response = await createAttendance(Number(eventId));
        console.log("Attendance successful:", response);
        setIsAttending(true); // Update the state
      } catch (error) {
        console.error("Error attending event:", error);
      }
    }
  };
  
  

  const handleUnattend = async () => {
    if (eventId) {
      try {
        console.log(`Cancelling attendance for event with ID: ${eventId}`);
        const response = await deleteAttendance(Number(eventId)); 
        
        console.log("Attendance successfully canceled:", response);
        setIsAttending(false);
      } catch (error) {
        console.error("Error removing attendance:", error);
      }
    } else {
      console.error("No eventId provided for cancelling attendance.");
    }
  };
  

  return (
    <div>
      {isAttending ? (
        <button onClick={handleUnattend}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          marginRight: "10px",
      }}>Cancel Attendance</button>
      ) : (
        <button onClick={handleAttend}
          style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          marginRight: "10px",
      }}>Attend Event</button>
      )}
    </div>
  );
};
