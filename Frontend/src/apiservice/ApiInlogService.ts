import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// Niet AxiosInstance vergeten op te roepen als je wilt gebruiken guys

// Al uitgelegd in EventService file
const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5097", // Backend URL
    withCredentials: true, // Ensures cookies are sent
    headers: {
        "Content-Type": "application/json",
    },
});

// idk wrm ik wou exporteren lol
export default axiosInstance;

// interface gemaakt om te sturen naar backend, undefined is null maar dan in Typescript got it?
// Want als ik lege username en password heb, dan wil ik dat backend dat goed handeld
// Voorheen deed ik gewoon lege string en dat was ook een horrible experience
export interface LoginInformation{
    UserName: string | undefined,
    Password: string | undefined
}
// Nu de CRUD methodes oproepen

// Okay kijk hier moet ook komen dat als ik badrequest heb gwn de message ook krijg
// Zie ik wel later
// Dus stel je voor ik heb foute wachtwoord ofxo (401)
// Dan moet er geen 401 komen maar alleen maar 'Incorrect password'
export async function login(payload: LoginInformation): Promise<any>{
    try{
    const response = await axiosInstance.post("/api/v1/Login/Login", payload);
    return response.data
    }
    catch (error: any)
    {
        // de data is de message die je uit backend krijgt wanneer iets fout gaat
        return error.response.data
    }
}

export async function logout(): Promise<any>
{
    // BELANGRIJK!
    try{
        // Oke dus voorheen in ApiEventService zei ik je hoeft niet persee axiosInstance te maken toch
    const response = await axios.get("http://localhost:5097/api/v1/Login/Logout", { //Hier gebruik je url van backend
        withCredentials: true
    })
    // Als ik geen axiosInstance gebruik, moet ik niet vergeten om '{withCredentials: true}' toe te voegen als argument
    return response.data
    // returned whatever je van de backend krijgt
    }
    catch (error: any)
    {
        return error.response.data
        // returned error response die je van de backend krijgt
    }
}
// Checked of admin logged in
export async function CheckUserType(): Promise<any>
{
    // Niet vergeten wat te doen met Credentials= true
    // Good night bb
    try{
    const response = await axios.get("http://localhost:5097/api/v1/Login/IsAdminLoggedIn", {
        withCredentials: true
    });
    return response.data
    }
    catch (error: any)
    {
       return error.response.data
    }
}