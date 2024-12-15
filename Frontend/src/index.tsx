import * as React from "react";
import {createRoot} from "react-dom/client"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import {LoginPageWrapper} from "./pages/LoginPage"
import {RegistrationPageWrapper} from "./pages/RegistrationPage"
import {UserDashboard} from "./pages/UserDashboard"
import {AdminDashboard} from "./pages/AdminDashboard"

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPageWrapper />} />
                <Route path="/register" element={<RegistrationPageWrapper />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admindashboard" element={<AdminDashboard />}/>
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