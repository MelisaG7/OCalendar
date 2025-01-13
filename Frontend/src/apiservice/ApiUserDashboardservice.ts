import axios, { AxiosInstance } from "axios";
import { Attendance } from "./ApiRegistrationService";


// Create the axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5097",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});



// Fetch a list of future events
export async function GetFutureEvents(): Promise<any[]> {
  try {
    const response = await axiosInstance.get("/api/v1/Events/FutureEvents");
    return response.data.$values ; // Assuming data is under $values
  } catch (error) {
    console.error("Error fetching future events:", error);
    throw error; // Re-throw to handle in the calling function
  }
}



// Register attendance for an event
export const createEventAttendance = async (eventId: number) => {
      
  try {
    const userResponse = await axiosInstance.get("/api/v1/Login/ByEmail");
    const userId = userResponse.data.userId;

    const response = await axiosInstance.post("http://localhost:5097/api/v1/EventsAD/AttendEvent", {
      user_id: userId, 
      event_id: eventId,
    });

    return response.data;
  } catch (error) {
    console.error(`Error attending event with ID ${eventId}:`, error);
    throw error;
  }
};


// Remove attendance for an event
export const deleteEventAttendance = async (eventId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/EventsAD/RemoveAttendance/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing attendance for event with ID ${eventId}:`, error);
    throw error;
  }
};

export const getAttendingEvents = async (): Promise<any[]> => {
  try {

    const userResponse = await axiosInstance.get("/api/v1/Login/ByEmail");
    const userId = userResponse.data.userId;
    const response = await axiosInstance.get(`/api/v1/EventsAD/AttendingEvents/${userId}`);
    return response.data.$values ;  // Return the attending events list
  } catch (error) {
    console.error("Error fetching attending events:", error);
    throw error;
  }
};

export const getAttendances = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get(`api/v1/Attendance/AllAttendances`);
    return response.data.$values ;  // Return the attending events list
  } catch (error) {
    console.error("Error fetching attending events:", error);
    throw error;
  }
};


export const createOfficeAttendance = async (attendanceDate: string) => {
  try {
    // Convert the attendanceDate string to a JavaScript Date object
    const dateObject = new Date(`${attendanceDate}`);
    const isostring = dateObject.toISOString();

    console.log("Generated ISO String:", isostring); // Generated ISO String: 2025-01-28T00:00:00.000Z
    //  I dont understand why but the controller doesnt process it as a datetime object
    const response = await axiosInstance.post("/api/v1/Attendance/Add", { attendanceDate: isostring }); 
    return response.data;
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw error;
  }
};



// Update office attendance
export const updateOfficeAttendance = async (attendanceId: number, newDate: string) => {
  try {
    const response = await axiosInstance.put(`/api/v1/Attendance/Update/${attendanceId}`, { newDate });
    return response.data;
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

// Delete office attendance
export const deleteOfficeAttendance = async (attendanceId: number) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/Attendance/Delete/${attendanceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting attendance:", error);
    throw error;
  }
};

