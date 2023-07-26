import { useState } from "react";
import axios from "axios"
import {useCookies} from "react-cookie"
import {useNavigate} from "react-router-dom"

export const UserLogin = ()=>{

    //using the useState hook to save and modify the state of variables

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");


    //the useCookies hook is used for user authorization purposes

    const [_,setCookies] = useCookies(["access_token"]);


    //used for navigation between routes

    const nav = useNavigate()


    const onSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

        event.preventDefault();

        try{
            //axios put request to verify user authentication
            const response = await axios.put("https://homehub-api.onrender.com/auth/login",{
                username:username,
                password:password
            });

            //alert neccessary message
            alert(response.data.message);

            //if json web token is given
            if(response.data.token){

                //store it in cookies for later authorization
                setCookies("access_token", response.data.token)

                //store the userId in local storage
                window.localStorage.setItem("userId",response.data.userId)

                //navigate to homescreen
                nav("/");
            }

        }catch(e){
            console.log(e);
        }
    }
   
    return (
    
    <div className = "in-form">
        <h1>Login</h1>
        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="floatingInput1" onChange={(event)=>{setUsername(event.target.value)}}/>
            <label htmlFor="floatingInput1">Username</label>
        </div>
        <div className="form-floating">
            <input type="password" className="form-control" id="floatingPass1" onChange={(event)=>{setPassword(event.target.value)}}/>
            <label htmlFor="floatingPass1">Password</label>
        </div>

        <div className=" text-center">
            <button type="button" className="btn btn-success mt-3" onClick={(event)=>{onSubmit(event)}}>Login</button>
        </div>

    </div>
     
    )
}




