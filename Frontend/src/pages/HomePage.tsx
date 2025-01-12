import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1 style={{ fontFamily: "Arial, sans-serif", color: "gray", textAlign: "center" }}>HomePage</h1>
            <h3 style={{fontFamily: "Arial, sans-serif", color: "black", textAlign: "center"}}> Log in to go to the dashboard.</h3>
            {/* Buttons die naar de login page en register page gaan met behulp van navigate functie */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "175px" }}>
                    <button onClick={() => navigate("/login")}
                        style={{ fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "gray", padding: "10px 15px", marginRight: "10px", textAlign: "center", border: "none"}}>Login</button>
                    <button onClick={() => navigate("/register")}
                        style={{ fontFamily: "Arial, sans-serif", color: "white", backgroundColor: "gray", padding: "10px 15px", border: "none"}}>Register</button>
                </div>
                <div style={{ marginTop: "10px" }}>No account yet? Register!</div>
            </div>
        </div>
    );
};


export default HomePage;