import React from "react";
import {User} from "../states/RegisterState";
import { register } from "../apiservice/ApiRegistrationService";
import { useNavigate } from "react-router-dom";

interface UserAndMessage extends User{
    Message: string
}

export class RegistrationPage extends React.Component<{navigate : (path: string) => void}, UserAndMessage>
{
    constructor(props: {navigate : (path: string) => void})
    {
        super(props)
        this.state =
        {
            FirstName: "",
            LastName: "",
            Email: "",
            Password: "",
            RecurringDays: "",
            Message: "",
        }
    }
    // Callt API functie die met backend communiceert
    HandleSubmit = async () =>
    {
        const{FirstName, LastName, Email, Password, RecurringDays} = this.state;
        const response = await register({FirstName: FirstName, //Register is de api functie in de folder apiservice
            LastName: LastName, Email: Email, Password: Password, RecurringDays: RecurringDays})
        this.setState({...this.state, Message: response})
    }

    HandleBack =  () =>
    {
        this.props.navigate("/")
    }

    render(){
        // Niks bijzonders hier. THe usual
        return(
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexDirection: "column", height: "100vh", paddingTop: "20px", fontFamily: "Arial, sans-serif" }}>
                <div style={{ position: "relative", top: 0, marginBottom: "20px" }}>
                <h1 style={{ fontFamily: "Arial, sans-serif", color: "gray" }}>Registration</h1>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    First name: 
                    <input
                    value={this.state.FirstName}
                    onChange={e => this.setState({...this.state, FirstName: e.currentTarget.value})}>
                    </input>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    Last name:
                    <input
                    value={this.state.LastName}
                    onChange={e=> this.setState({...this.state, LastName: e.currentTarget.value})}>
                    </input>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    Email:
                    <input
                    value={this.state.Email}
                    onChange={e=>this.setState({...this.state, Email: e.currentTarget.value})}>
                    </input>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    Password:
                    <input
                    value={this.state.Password}
                    onChange={e=>this.setState({...this.state, Password: e.currentTarget.value})}>
                    </input>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    Recuring days:
                    <input
                    value={this.state.RecurringDays}
                    onChange={e=>this.setState({...this.state, RecurringDays: e.currentTarget.value})}>
                    </input>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <button
                        onClick={this.HandleSubmit}
                        style={{ color: "white", backgroundColor: "gray", padding: "10px 15px", marginRight: "10px", border: "none" }}>
                        Submit
                    </button>
                    <button onClick={this.HandleBack}
                        style={{ color: "white", backgroundColor: "gray", padding: "10px 15px", border: "none" }}>
                        Back
                    </button>
                </div>
                <div>
                    {this.state.Message}
                </div>
            </div>
        )
    }
}
// All my homies hate classes
export const RegistrationPageWrapper : React.FC = () =>
{
    const navigate = useNavigate()
    return <RegistrationPage navigate={navigate}/>
}