import "../App.css" //import for styles
import axios from "axios"//import to access backend

//imports for components
import { HomeLogin } from "../components/homeLogin"
import { HomeRegister } from "../components/homeRegister"

//react imports
import { useEffect, useState } from "react"
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom"


export const Home = ()=>{

    //using the useState hook to save and modify the state of variable, used to check if user has a home

    const [hasHome,setHome] = useState(-1)


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);


    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")


    //used to navigagte between routes

    const nav = useNavigate()


    const loadHome = async ()=>{

        try {
            //axios get request to return information about the current user
            const response = await axios.get(`https://homehub-api.onrender.com/auth/${userId}`)

            if(response.data.home != -1){
                //if the user has a home, update the variable
                setHome(response.data.home)
                
                if(cookies.access_token){
                    //if the user is also signed in, take them to the full homepage
                    nav("/home")
                }
                
            }
            else{
                //if not set it to -1
                setHome(-1)
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    //this will re-render the screen when the hasHome variable is changed

    useEffect(()=>{loadHome()},[hasHome])

 
    return (

        <div> 

            {cookies.access_token ? ( 
                <div className="home-page">
                    <div className = "form">
                        <HomeRegister/>
                    </div>
                    <div className = "form">
                        <HomeLogin/>
                    </div>
                </div>
                ) : (
                  
                <div className = "pt-5">
                    <div className = "form">
                        <div className = "in-form">
                            <div className = "text-center pb-3">
                                <h1 >Sign In To Access Your HomeHub</h1>                   
                            </div>
                            <div className = "text-center pt-3 pb-2">
                                <h4 >Gain Access To Many Features Including :</h4>  
                            </div>
                            <div>  
                                <ul>
                                <li>A House Todo</li>
                                <li>A House Chat</li>
                                <li>A House Ledger To Manage Explense Splitting</li>
                                </ul>
                            </div>              
                        </div>
                    </div>
                </div>
            )
                }</div>)

}
