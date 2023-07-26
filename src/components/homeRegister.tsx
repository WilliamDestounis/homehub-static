import axios from "axios"//import to access backend

//react imports
import { useState } from "react"
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom";


export const HomeRegister = ()=>{

    //using the useState hook to save and modify the state of variables

    const [name,setName] = useState("");
    const [code,setCode] = useState("");


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);


    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")


    //used to navigagte between routes

    const nav = useNavigate()


    const onSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

        event.preventDefault()

        try{
            //axios post request to send information about the current user, it will create a Home model
            const response = await axios.post("http://localhost:3001/home/create",{
                name:name,
                code:code,
                userId: userId
            },{headers: {authorization: cookies.access_token}});
            
            alert(response.data.message);

            if(response.data.complete){
                //if completed, navigate to the homepage
                nav("/home")
            }

        }catch(e){
            console.log(e);
        }
            
    }

    return (
    
    <div className="in-form">
        
        <h1>Create A Home</h1>
        
        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="floatingInput4" onChange={(event)=>setName(event.target.value)}/>
             <label htmlFor="floatingInput4">Username</label>
        </div>
        
        <div className="form-floating mb-3">
            <input type="password" className="form-control" id="floatingPasswor4" onChange={(event)=>setCode(event.target.value)}/>
            <label htmlFor="floatingPassword4">Password</label>
        </div>

        <div className=" text-center">
            <button type="button" className="btn btn-success" onClick = {(event)=>onSubmit(event)}>Register</button>
        </div>

    </div>
     
    )
}