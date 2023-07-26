import axios from "axios" //import to access backend

//react imports
import { useEffect, useState } from "react"
import {useCookies} from "react-cookie"
import { useNavigate } from "react-router-dom"

//interface for memObj object structure

interface membObj{
    memberId: Number,
    name: String
}

export const SplitExpense = ()=>{

    //using the useState hook to save and modify the state of variables

    //homeMembers is an array that holds membObj objects of the members in the users house
    const [homeMembers,setHomeMembers]= useState(Array<membObj>())

    //splitMembers is an array that holds the userId of selected members
    const [splitMembers,setSplitMembers] = useState(new Array<Number>())

    const [expName,setExpName]= useState("")

    const [exp,setExp]= useState("")


    //the useCookies hook is used for user authorization purposes
    const [cookies,_] = useCookies(["access_token"]);


    //the current userId is stored in userId variable
    const userId = window.localStorage.getItem("userId")


    //used for navigation between routes
    const nav = useNavigate()


    const loadSplit = async ()=>{

        try {
            //axios get request to return information about the current user
            const response = await axios.get(`https://homehub-api.onrender.com/ledger/${userId}`,{headers: {authorization: cookies.access_token}})

            if(response.data.homeMembers){
                //if homeMembers exist, then update for display
                //a membObj is returned
                setHomeMembers(response.data.homeMembers)
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    //useEffect hook is used to call the loadLedger function upon initial rendering

    useEffect(()=>{loadSplit()},[])


    //this function is called when a user selects members from the house members list
    const setActiveMembers = (member:membObj)=>{
        
        if(splitMembers.includes(member.memberId)){
            //if the member selected was previously selected, filter it out of the array
            let newSplitMembers = splitMembers.filter((e)=>{
                return e != member.memberId
            })

            //update splitMembers
            setSplitMembers(newSplitMembers)
        }
        else{
            //if not, add the memberId to the array
            setSplitMembers([...splitMembers,member.memberId])
        }
     }

    const split = async ()=>{

        //find the split amount per member
        const splitAmount = Number(exp)/Number(splitMembers.length)

        const testExp = Number(exp)

        //conditions
        if(!expName){
            alert("You Must Enter An Expense Name")
            return
        }
        if(!exp){
            alert("You Must Enter An Expense Amount, In Dollars")
            return

        }
        if(isNaN(testExp)){
            alert("You Must Enter A Valid Number")
            return

        }

        if(splitMembers.length < 1){
            alert("You Must Select members To Split With")
            return
        }

        let recId;
    
        try{
            //axios post request to send information to the API 
            //the backend will create a Recievables model and add it to the users "recievables" array
            const response = await axios.post("https://homehub-api.onrender.com/ledger/addSplit",{
                userId : userId,
                expName : expName,
                exp : exp,
                splitMembers : splitMembers,
                splitAmount:splitAmount
            },{headers: {authorization: cookies.access_token}})
                
            recId = response.data.recId;

        }catch(error){
            console.log(error)
        }
        try{
            //axios post request to send information to the API 
            //the backend will create a Payables model for each selected split member and add it to their "payables" array
            await axios.post("https://homehub-api.onrender.com/ledger/split",{
                userId : userId,
                recId:recId,
                expName : expName,
                exp : exp,
                splitMembers : splitMembers,
                splitAmount:splitAmount
            },{headers: {authorization: cookies.access_token}})

        }
        catch(error){
            console.log(error)
        }

        alert("Expense Split !")

        nav("/")

    }

    return (
    
        <div className="form">

        <div className = "in-form">
        
         <h1>Split Expense</h1>

        <ul className="list-group m-3">
        { homeMembers.map((element,index)=>{
        return <li className ={splitMembers.includes(element.memberId) ?"active list-group-item":"list-group-item"} key={index} onClick={()=>setActiveMembers(element)}>{element.name}</li>})}
        </ul>

        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="expenseName" onChange={(event)=>{setExpName(event.target.value)}} />
             <label htmlFor="expenseName">Expense Name</label>
        </div>
        
        <div className="form-floating mb-3">
            <input type="text" className="form-control" id="expenseAmount" onChange={(event)=>{setExp(event.target.value)} }/>
            <label htmlFor="expenseAmount">Expense Amount ($)</label>
        </div>

        <div className=" text-center">
            <button type="button" className="btn btn-success" onClick={split} >Split</button>
        </div>

        </div>

    
    </div>
     
    )
}
