
export interface Attendance
{
    AttendanceId: number,
    AttendanceDate: TimeRanges
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

export interface User
{
    FirstName: string
    LastName: string
    Email: string
    Password: string
    RecurringDays: string
}


