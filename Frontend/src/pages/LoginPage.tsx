import React from "react";
import {LoginState} from "../states/LoginState"
import { login, CheckUserType} from "../apiservice/ApiInlogService";
import { useNavigate } from "react-router-dom";

interface LoginPageState extends LoginState {
    Message: string; // State to hold backend response message
}

// Yuckk.....classes. Had ik gebruikt voordat ik realiseerde dat hookers veel simpeler zijn
// DONT DO THIS PLEASE als je je leven makkelijker wilt maken
export class LoginPage extends React.Component<{navigate: (path: string) => void}, LoginPageState>
{
    // Ik moest helemaal navigate passen via constructor en stuff snapte het nieteens hoe :-(
    constructor(props: {navigate: (path: string) => void})
    {
        super(props)
        this.state = {
            UserName: undefined,
            Password: undefined,
            Message: ""
        }
    }
    // Handeld de navigatie voor teruggaan naar de root pagina
    HandleBack = () =>
    {
        this.props.navigate("/")
    }
    HandleSubmit = async () =>
    {
        // Ik moet hier iets doen met de IsAdminLoggedIn functie in backend + de api.
        // Dus als de get een bepaalde iets geeft, moet ik naar de userDashboard gaan ofzo
        const{UserName, Password} = this.state;
        const response = await login({UserName: UserName, Password: Password})
        if (response !== "Login successful") {
            this.setState({ Message: "Login failed" });
        }
        this.setState({...this.state, Message: response})
        // 1 seconde wachten voor de lol
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Als response gelukt is checken we met andere api methode of ie user is of niet
        // Als niet -> GoToUserDashboard
        // Als wel -> GoToAdminDashboard
        const CheckAdminLoggedIn = await CheckUserType() // 200 ok als admin, else 401
        // this.setState({...this.state, Message: CheckAdminLoggedIn})
        response == "Login successful" && CheckAdminLoggedIn == "Admin not logged in" ? this.GoToUserDashboard() : this.GoToAdminDashboard()
    }

    // Eigenlijk hoef je hier geen functie idk wrm ik het wel deed.
    // Teveel lijnen
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
        // Input en state verandered, niets speciaals
        return(
            <div>
                <div>
                    Email:
                    <input
                    value={this.state.UserName}
                    onChange={e => this.setState({...this.state, UserName: e.currentTarget.value})}
                    />
                </div>
                <div>
                    Password:
                    <input 
                    value={this.state.Password}
                    onChange={e => this.setState({...this.state, Password: e.currentTarget.value})}
                    />
                </div>
                <div>
                    <button
                    onClick={this.HandleSubmit}>
                        Submit</button>
                    <button onClick={this.HandleBack}>Back</button>
                    {/* Oke en als ik heb gecliked moet ik naar Dashboard basically. Dus iets met onChange */}
                    {/* Voor nu ga ik even de dashboard stuff preppen */}

                    {/* Again: Als ik een admin ben moet ik na sumbit naar -> administrative dahsboard */}
                    {/* Als ik normale user ben dan moet ik naar -> homepage/dashboard. Plek waar je events kan zien basically */}
                    {/* Ik maak dan methode die dat handled. Differentieren tussen normale user en admin */}
                </div>
                <div>
                    {this.state.Message}
                </div>
            </div>
        )
    }
}

// Kijk deze functie hoefde helemaal niet als je gwn hooker ipv class gebruikt
// Kan je ook veel meer dingen gebruiken en hooker is veel veel moderner.
export const LoginPageWrapper: React.FC = () =>
{
    const navigate = useNavigate()
    return <LoginPage navigate={navigate}/>
}