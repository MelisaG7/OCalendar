import axios from "axios";
import {User} from "../states/RegisterState"

export async function register(payload: User): Promise<any>
{
    const GetLastUserIdResponse = await axios.get<number>("http://localhost:5097/api/v1/Login/LastUserId")

    const LastUserId = GetLastUserIdResponse.data === -1 ? 1 : GetLastUserIdResponse.data + 1

    const EntireUser: RegistrationInformation = {
        UserId: LastUserId,
        FirstName: payload.FirstName,
        LastName: payload.LastName,
        Email: payload.Email,
        Password: payload.Password,
        RecuringDays: payload.RecurringDays,
        Attendances: [],
        Event_Attendances: []
    }
    try{
    const response = await axios.post("http://localhost:5097/api/v1/Login/Register", EntireUser, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.data
    }
    catch (error: any)
    {
        return error.response.data
    }
}

export interface Attendance
{
    AttendanceId: number,
    AttendanceDate: string
    User: RegistrationInformation
}

export interface Event_Attendance
{
    Event_AttendanceId: number
    Rating: number
    Feedback: string
    User: RegistrationInformation
    Event: Event
}

export interface Event
{
    EventId: number
    Title: string
    Description: string
    EventDate: Date
    StartTime: string
    EndTime: string
    Location: string
    AdminApproval: boolean
    Event_Attendances: Event_Attendance[]
    AverageRating: number
}

export interface RegistrationInformation
{
    UserId: number
    FirstName: string
    LastName: string
    Email: string
    Password: string
    RecuringDays: string
    Attendances: Attendance[]
    Event_Attendances: Event_Attendance[]
}

