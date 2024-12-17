import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    // Zelfde Navigeer functie
    const navigate = useNavigate();

    return (
        <div>
            <h1>HomePage</h1>
            <h3> Log in to go to the dashboard.</h3>
            {/* Buttons die naar de login page en register page gaan met behulp van navigate functie */}
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
            <div>No account yet? Register!</div>
        </div>
    );
};

export default HomePage;