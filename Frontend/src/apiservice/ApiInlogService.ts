import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5097", // Backend URL
    withCredentials: true, // Ensures cookies are sent
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;

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
    const response = await axiosInstance.post("/api/v1/Login/Login", payload);
    return response.data
}

// Checked of admin logged in
export async function CheckUserType(): Promise<any>
{
    try{
    const response = await axios.get("/api/v1/Login/IsAdminLoggedIn");
    return response.data
    }
    catch (error: any)
    {
       return "Admin not logged in"
    }
}