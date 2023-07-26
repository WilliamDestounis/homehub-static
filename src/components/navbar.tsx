import { Link, NavLink, useNavigate } from 'react-router-dom' //imports to set up navigation between routes
import {useCookies} from "react-cookie"//import for user authorization
import "../App.css" //import for styles

export const Navbar = ()=>{

  //the useCookies hook is used for user authorization purposes
  const [cookies,setCookies] = useCookies(["access_token"])

  //used to navigate between routes
  const nav = useNavigate()

  //function called when a user logs out
  const Logout= ()=>{

    //cookies are emptied and local storage is cleared
    setCookies("access_token","");
    window.localStorage.removeItem("userID");

    //user is navigated to home screen
    nav("/")

  }

    return (

        <div>

          <div className="nav mb-5">

          <h1 className="display-2 white-text m-2">HomeHub</h1>

            <div className="navi ">
  
            <NavLink to="/" className="nav-item">Home</NavLink>
            <Link to="/todo" className={cookies.access_token?"nav-item":"r-nav-item"}>Home Todo</Link>
            <Link to="/chat" className={cookies.access_token?"nav-item":"r-nav-item"}>Home Chat</Link>
            <Link to="/split" className={cookies.access_token?"nav-item":"r-nav-item"}>Split Expense</Link>
            {!cookies.access_token ? (<Link to="/auth" className="nav-item">Sign In</Link>): <button className="btn btn-primary " onClick={Logout}>Log Out</button>}
            
            </div>
          
          </div>
         
      </div>         
    )
}