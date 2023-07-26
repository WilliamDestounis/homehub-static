import axios from "axios" //import to access backend

//react imports
import { useEffect, useState } from "react";
import {useCookies} from "react-cookie"

//creating an interface to define structure of chat objects

interface chatObjInterface{
    chat:string,
    chatId:string
    name:string
}


export const HomeChat = ()=>{

    //using the useState hook to save and modify the state of variables

    const [chat,setChat] = useState("");

    const [groupChat,setGroupChat] = useState(new Array<chatObjInterface>())


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);


    //the useEffect hook is used to re-render the groupchat, when first rendered and when a change occurs to groupChat

    useEffect(()=>{loadChat()},[groupChat])
    

    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")


    const loadChat = async ()=>{

    try{
        //axios get request to return information about the current user
        const response = await axios.get(`http://localhost:3001/chat/${userId}`,{headers: {authorization: cookies.access_token}})

        const chatObjArray = response.data.chat

        if(chatObjArray){
            //if chatObjArray exists then update the group chat variable
            setGroupChat(chatObjArray)
        }

     }
     catch(e){
        console.log(e);
        }
    }

    const onSubmit = async (event:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{

        event.preventDefault();

        try{
            //put request to update the users home chat
            const response = await axios.put("http://localhost:3001/chat/addChat",{
                userId:userId,
                chat:chat
            },{headers: {authorization: cookies.access_token}})

            if(response.data.message){
                //if request is completed, alert the user with message
                alert(response.data.message);
            }

        }catch(e){
            console.log(e);
        }
    }
   
    return (
    
    <div className = "in-form">

        <h1 className="mb-3">Home Chat</h1>

        <ul className="list-group">

            {/* mapping groupChat to access and display attributes of the objects in the array */}

            {groupChat.map((c,index)=>{

                 {/* checking to see if the chat object was posted by the current user for display purposes */}

                let userChat = false

                if(c.chatId === userId ){
                    userChat  = true
                }
                
                return (<li className={`list-group-item ${userChat ? "user-chat" : "group-chat"}` }  key={index} >{`${c.name}   -   ${c.chat}`}</li>)
                    
            })
            }

        </ul>
        
            <div className="form-floating mt-3 mb-3">
                <input type="text" className="form-control" id="chatInput" onChange={(event)=>{setChat(event.target.value)}}/>
                <label htmlFor="chatInput">Chat</label>
            </div>

            <div className=" text-center">
                <button type="button" className="btn btn-success mt-3" onClick = {(event)=>onSubmit(event)}>Add</button>
            </div>
    
    </div>

     
    )}