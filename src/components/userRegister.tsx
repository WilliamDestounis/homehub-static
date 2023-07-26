import { useState } from "react"
import axios from "axios"


export const UserRegister = ()=>{

    //using the useState hook to save and modify the state of variables

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");


    const onSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

        event.preventDefault()

        try{
            //axios post request to create a user account
            const response = await axios.post("http://localhost:3001/auth/register",{
                username:username,
                password:password
            });

            //alert message
            alert(response.data.message);

        }catch(e){
            console.log(e);
        }
    
    }

    return (
    
        <div className="in-form">
        
        <h1>Register</h1>
        
        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="floatingInput2" onChange={(event)=>setUsername(event.target.value)}/>
             <label htmlFor="floatingInput2">Username</label>
        </div>
        
        <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword2" onChange={(event)=>setPassword(event.target.value)}/>
            <label htmlFor="floatingPassword2">Password</label>
        </div>

        <div className=" text-center">
            <button type="button" className="btn btn-success mt-3" onClick = {(event)=>onSubmit(event)}>Register</button>
        </div>

    </div>
     
    )
}