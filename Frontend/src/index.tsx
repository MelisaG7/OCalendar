// index.tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { LoginPageWrapper } from "./pages/LoginPage";
import { RegistrationPageWrapper } from "./pages/RegistrationPage";
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EventDetailPage } from "./pages/EventDetailPage";
import { CreateEditEvent } from "./pages/CreateEditEvent";
import { ViewAttendees } from "./pages/ViewAttendees";
import { AttendEventForm } from "./pages/AttendEventForm";
import { UserEventListPage } from "./pages/usereventlistpage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPageWrapper />} />
        <Route path="/register" element={<RegistrationPageWrapper />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/create-event" element={<CreateEditEvent />} />
        <Route path="/edit-event" element={<CreateEditEvent />} />
        <Route path="/view-attendees" element={<ViewAttendees />} />
        <Route path="/eventdetails/:eventId" element={<EventDetailPage />} />
        <Route path="/eventattendance/:eventId" element={<AttendEventForm />} />
        <Route path="/events" element={<UserEventListPage />} />

      </Routes>
    </Router>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
