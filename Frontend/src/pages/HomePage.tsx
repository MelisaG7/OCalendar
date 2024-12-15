import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>HomePage</h1>
            <h3> Log in to go to the dashboard.</h3>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
            <div>No account yet? Register!</div>
        </div>
    );
};

export default HomePage;