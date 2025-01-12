import React from "react";
import {LoginState} from "../states/LoginState"
import { login, CheckUserType} from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

interface LoginPageState extends LoginState {
    Message: string; // State to hold backend response message
}

export class LoginPage extends React.Component<{navigate: (path: string) => void}, LoginPageState>
{
    constructor(props: {navigate: (path: string) => void})
    {
        super(props)
        this.state = {
            UserName: undefined,
            Password: undefined,
            Message: ""
        }
    }

    HandleBack = () =>
    {
        this.props.navigate("/")
    }

    HandleSubmit = async () =>
    {
        const { UserName, Password } = this.state;
        const response = await login({ UserName: UserName, Password: Password });
        if (response !== "Login successful") {
            this.setState({ Message: "Login failed" });
        }

        this.setState({ ...this.state, Message: response });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const CheckAdminLoggedIn = await CheckUserType();
        CheckAdminLoggedIn == UserName ? this.GoToAdminDashboard() : this.GoToUserDashboard();
    }

    ReturnState()
    {
        return this.state.UserName
    }
    GoToUserDashboard = () =>
    {
        this.props.navigate("/dashboard")
    }

    GoToAdminDashboard = () =>
    {
        this.props.navigate("/admindashboard")
    }

    render()
    {
        return (
            <div>
                <h1 style={{ fontFamily: "Arial, sans-serif", color: "gray", textAlign: "center" }}>Log in</h1>
                <div style={{ textAlign: "center" }}>
                    <label style={{ fontFamily: "Arial, sans-serif" }}>Email:</label>
                    <input
                        value={this.state.UserName}
                        onChange={e => this.setState({ ...this.state, UserName: e.currentTarget.value })}
                    />
                </div>
                <div style={{ textAlign: "center" }}>
                    <label style={{ fontFamily: "Arial, sans-serif" }}>Password:</label>
                    <input
                        type="password"
                        value={this.state.Password}
                        onChange={e => this.setState({ ...this.state, Password: e.currentTarget.value })}
                    />
                </div>
                <div style={{ textAlign: "center" }}>
                    <button
                        style={{ fontFamily: "Arial, sans-serif", padding: "10px 15px", backgroundColor: "gray", color: "white", margin: "5px" }}
                        onClick={this.HandleSubmit}>
                        Submit</button>
                    <button
                        style={{ fontFamily: "Arial, sans-serif", padding: "10px 15px", backgroundColor: "gray", color: "white", margin: "5px" }}
                        onClick={this.HandleBack}>Back</button>
                </div>
                <div>
                    {this.state.Message}
                </div>
            </div>
        )
    }
}

export const LoginPageWrapper: React.FC = () =>
{
    const navigate = useNavigate()
    return <LoginPage navigate={navigate}/>
}


