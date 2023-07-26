import { UserLogin } from "../components/userLogin"
import { UserRegister } from "../components/userRegister"

//page for authentication

export const Auth = ()=>{
    return (
        <div className="form">
            <UserRegister/>
            <UserLogin/>
        </div>
    )

}
