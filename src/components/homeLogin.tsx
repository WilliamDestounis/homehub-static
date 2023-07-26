import axios from "axios" //import to access backend

//react imports
import { useState } from "react";
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom";


export const HomeLogin = ()=>{   

    //using the useState hook to save and modify the state of variables
    //these variables are updated through user interaction using the onChange html property and react hooks

    const [name,setName] = useState("");
    const [code,setCode] = useState("");


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);


    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")


    //used to navigagte between routes

    const nav = useNavigate()


    const onSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

        event.preventDefault();

        try{
            //axios put request confirm correct user input
            const response = await axios.put("http://localhost:3001/home/join",{
                name:name,
                code:code,
                userId:userId
            },{headers: {authorization: cookies.access_token}});

            alert(response.data.message);

            if(response.data.suc){
                //if completed, navigate to the homepage
                nav("/home")
            }

        }catch(e){
            console.log(e);
        }

    }
   
    return (
    
    <div className = "in-form">
        
        <h1>Join A Home</h1>
        
        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="floatingInput3" onChange={(event)=>{setName(event.target.value)}}/>
            <label htmlFor="floatingInput3">Username</label>
        </div>

        <div className="form-floating mb-3">
            <input type="password" className="form-control" id="floatingPass3" onChange={(event)=>{setCode(event.target.value)}}/>
            <label htmlFor="floatingPass3">Password</label>
        </div>

        <div className=" text-center">
            <button type="button" className="btn btn-success" onClick={(event)=>{onSubmit(event)}}>Login</button>
        </div>
        </div>

     
    )}