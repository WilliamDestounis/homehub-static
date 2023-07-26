import axios from "axios" //import to access backend

//react imports
import { useEffect, useState } from "react"
import {useCookies} from "react-cookie"


//creating an interface to define structure of member objects - that are stored in the Home model

interface membObj{
    memeberId: String,
    name: String
}

//creating an interface to define structure of recievable abd payable objects - that are stored in the User model

interface recObj{
    expName:String,
    exp:String,
    splitMembers:String[],
    splitAmount:Number
}

interface payObj{
    userSent: String,
    expName:String,
    exp:String,
    splitAmount:Number
}


export const Ledger = ()=>{

    //using the useState hook to save and modify the state of variables

    const [homeMembers,setHomeMembers]= useState(Array<membObj>())

    const [recievables,setRecievables]= useState(Array<recObj>())

    const [payables,setPayables]= useState(Array<payObj>())

    const [active,setActive] = useState(-1)


    //the useCookies hook is used for user authorization purposes

    const [cookies,_] = useCookies(["access_token"]);


    //the current userId is stored in userId variable

    const userId = window.localStorage.getItem("userId")


    const loadLedger = async ()=>{

        try {
            //axios get request to return information about the current user
            const response = await axios.get(`http://localhost:3001/ledger/${userId}`,{headers: {authorization: cookies.access_token}})

            //using response data to update variables, this will help set up the ledger display

            setHomeMembers(response.data.homeMembers)
            setRecievables(response.data.recievables)
            setPayables(response.data.payables)

        } catch (error) {
            console.log(error)
        }
    }

    //useEffect hook is used to call the loadLedger function upon initial rendering

    useEffect(()=>{loadLedger()},[])

    const onSubmit = async ()=>{

        let recId,payId,paid;

        try {

            //axios put request to update information in database, the userid and the selected payable are sent to the API
            //this will remove the payable object from the payables array in the current user
            //if the expense is paid off, the recievables object Id will be removed from the sentUsers "recievables" array

            const response = await axios.put(`http://localhost:3001/ledger/paySplit`,{
                userId:userId,
                payIndex:active 
            },{headers: {authorization: cookies.access_token}})


            //the recId is the id of the recievable object in the database
            recId = response.data.recId;

            //the payId is the id of the payable object in the database
            payId = response.data.payId;
            
            //the paid variable is true if the expense is fully paid
            paid = response.data.paid

            
        } catch (error) {
            console.log(error)
        }

        try {
            //axios delete request to delete the Payable model assosiated with the user id from the Payables collection
            await axios.delete(`http://localhost:3001/remove/paySplitP/${payId}`,{headers: {authorization: cookies.access_token}})

        } catch (error) {
            console.log(error)
        }

        //if the expense is fully paid, the recId is sent to the API via axios delete request
        if(paid){
            try {
                //the Recievable model associated with the userSent id is deleted from the database and from their recievables array
                await axios.delete(`http://localhost:3001/remove/paySplitR/${recId}`,{headers: {authorization: cookies.access_token}})

            } catch (error) {
                console.log(error)
            }
        }

        //the loadLedger() function is called to reflect changes in the users profile
        loadLedger()

    }

    //this function sets the active variable to hold the index of the chosed payable
    const setActivePayable = (index:number)=>{
        
        if(index === active){
            setActive(-1)
        }
        else{
            setActive(index)

        }
    }
   
    return (

    <div>

        <div className = "form mt-3 mb-5">
            <div className = "in-form">

                <h1>Home Members</h1>

                <ul className = "list-group in-form">
                    { homeMembers.map((element,index)=>{
                    return <li className = "list-group-item" key={index} >{element.name}</li>})}
                </ul>

            </div>
        </div>

        <div className="ledger mt-3">


            <div className = "form">
                <div className = "in-form">

                    <h1>Receivables</h1>

                    <ul className = "list-group in-form">
                        { recievables.map((element,index)=>{
                        return <li className = "list-group-item" key={index} >{`${element.expName} - ${element.exp} `}</li>})}
                    </ul>

                </div>
            </div>

            <div className = "form">
                <div className = "in-form ">

                    <h1>Payables</h1>

                    <ul className = "list-group in-form">
                        { payables.map((element,index)=>{
                        return <li className = {index===active ?"active list-group-item":"list-group-item"} key={index} onClick={()=>setActivePayable(index)}>
                        {`${element.expName} - ${element.splitAmount}`}</li>})}
                    </ul>

                    <div className= "text-center">
                        <button type="button" className="btn btn-success text-center" onClick={()=>onSubmit()}>pay</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    
    )
}
        