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
    HandleSubmit = async () =>
    {
        const{FirstName, LastName, Email, Password, RecurringDays} = this.state;
        const response = await register({FirstName: FirstName,
            LastName: LastName, Email: Email, Password: Password, RecurringDays: RecurringDays})
        this.setState({...this.state, Message: response})
    }

    HandleBack =  () =>
    {
        this.props.navigate("/")
    }

    render(){
        return(
            <div>
                Registration page
                <div>
                    First name: 
                    <input
                    value={this.state.FirstName}
                    onChange={e => this.setState({...this.state, FirstName: e.currentTarget.value})}>
                    </input>
                </div>
                <div>
                    Last name:
                    <input
                    value={this.state.LastName}
                    onChange={e=> this.setState({...this.setState, LastName: e.currentTarget.value})}>
                    </input>
                </div>
                <div>
                    Email:
                    <input
                    value={this.state.Email}
                    onChange={e=>this.setState({...this.state, Email: e.currentTarget.value})}>
                    </input>
                </div>
                <div>
                    Password:
                    <input
                    value={this.state.Password}
                    onChange={e=>this.setState({...this.state, Password: e.currentTarget.value})}>
                    </input>
                </div>
                <div>
                    Recuring days:
                    <input
                    value={this.state.RecurringDays}
                    onChange={e=>this.setState({...this.state, RecurringDays: e.currentTarget.value})}>
                    </input>
                </div>
                <button
                    onClick={this.HandleSubmit}>
                    Submit</button>
                    <button onClick={this.HandleBack}>Back</button>
                <div>
                    {this.state.Message}
                </div>
            </div>
        )
    }
}

export const RegistrationPageWrapper : React.FC = () =>
{
    const navigate = useNavigate()
    return <RegistrationPage navigate={navigate}/>
}