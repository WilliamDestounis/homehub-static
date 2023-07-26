import { useEffect, useState } from "react"
import axios from "axios"
import {useCookies} from "react-cookie"


export const TodoList = ()=>{

    //using the useState hook to save and modify the state of variables

    //todo stores the value of new todos to be added
    const [todo,setTodo] = useState("")
    //todoList stores the current todoList
    const [todoList,setTodoList] = useState(new Array<String>())
    //active holds the index of selected todo
    const [active,setActive] = useState(-1)


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);
    

    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")



    const loadTodo = async ()=>{

    try{
        //axios get request to return information about the current user
        const response = await axios.get(`https://homehub-api.onrender.com/todo/${userId}`,{headers: {authorization: cookies.access_token}})
        
        if(response.data.todo){
            //if a todo exists, modify the current todoList
            setTodoList(response.data.todo)
            }
    
     }
     catch(e){
        console.log(e);
        }
    }

    //useEffect hook is used to call the loadTodo function upon initial rendering and upon any changes to the todoList

    useEffect(()=>{loadTodo()},[])

    useEffect(()=>{loadTodo()},[todoList])


    const onSubmit = async ()=>{

        //check if a user correctly entered a todo
        if(todo){

            try{
                //axios put request to update information, the backend will add to the users home todo array
                const response = await axios.put("https://homehub-api.onrender.com/todo/addTodo",{
                    userId:userId,
                    newTodo: todo,
                },{headers: {authorization: cookies.access_token}});

                if(response.data.newTodoList){
                    //if successful, update todoLIst
                    setTodoList(response.data.newTodoList)
                    }

                if(response.data.message){
                    alert(response.data.message)
                }

            }catch(e){
                console.log(e);
            }
        }
        else{
            alert("Cannot Add Blank Todo")
        }


    }

    const onDelete = async ()=>{

        //element stores the todo that is selected
        const element = todoList[active];

            try{
                //axios put request to update information about the current user todoList
                const response = await axios.put("https://homehub-api.onrender.com/todo/deleteTodo",{
                    userId:userId,
                    element: element,
                },{headers: {authorization: cookies.access_token}});

                //if successful, update todoList
                if(response.data.newTodoList){
                        setTodoList(response.data.newTodoList)
                }
                //alert user with neccesary message
                if(response.data.message){
                    alert(response.data.message)
                } 
    
             }catch(e){
                console.log(e);
             }
        
    }

    //this function sets the active todo, depending on user input
    const setActiveTodo = (index:number)=>{
        
        if(index === active){
            setActive(-1)
        }
        else{
            setActive(index)

        }
    }

    return (
        <div className = "in-form">

            <h1 className="mb-3">Home Todo</h1>

            <ul className="list-group">
                {todoList.map((t,index)=>{return<li className ={index===active ?"active list-group-item":"list-group-item"} key={index} onClick={()=>setActiveTodo(index)} >{t}</li>})}
            </ul>

            <div className="form-floating mt-3 mb-3">
                <input type="text" className="form-control" id="todoInput" onChange={(event)=>{setTodo(event.target.value)}}/>
                <label htmlFor="todoInput">Todo</label>
            </div>

            <div className="text-center">
                <button type="button" className="btn btn-success m-3" onClick = {()=>onSubmit()}>Add</button>
                <button type="button" className="btn btn-success m-3"onClick = {()=>onDelete()} >Delete</button>
            </div>
        </div>
    )
}
