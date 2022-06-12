import React, { useRef,  useState } from "react";
// import { AuthContext } from "../Context/authContext";
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios'

export default function Register() {
    const [samePassword, setSamePassword] = useState(true) //Verifier le meme mot de passe
    const [newUser, setNewUser] = useState(true) //Verifier que l'utilisatuer est unique
    const [emptyField, setEmptyField] = useState(true) //Verifier que tous les champs ne sont pas vides.
    const [notEmail, setNotEmail] = useState(true) //Verifier que l'email est de bonne format
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const rePassword = useRef();
    // const {user, isFetching, error, dispatch} = useContext(AuthContext)
    const navigate = useNavigate();

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const userRegister= async (e)=>{
        e.preventDefault();
        
        if(validateEmail(email.current.value) && password.current.value === rePassword.current.value && username.current.value!=="" && email.current.value!=="" && password.current.value!==""){
            const user = {username:username.current.value, email:email.current.value,password:password.current.value, picture:"https://i.ibb.co/J25RQCT/profile.png", cover:"https://i.ibb.co/MVjMppt/cover.jpg"}
            try{
                setNewUser(true)
                await axios.post("http://localhost:5000/api/user/register",user);
                const users = await axios.get("http://localhost:5000/api/user/allusers");

                await Promise.all(users.data.map(async function(x) {
                    const res = await axios.post(`http://localhost:5000/api/conv/`, {senderId:user.username,receiverId:x.username});
                    return res.data
                }))

                navigate("/login");

            }catch(err){  
                setNewUser(false) //Cas d'existance d'un utilisateur avec soit le meme username soit le meme email
            }
        } else {
            if(password.current.value !== rePassword.current.value){
                rePassword.current.setCustomValidity("Passwords don't match!");
                setSamePassword(false); //Cas de mots de passe differents
            }else{
                setSamePassword(true)
            }
            if(!validateEmail(email.current.value)){
                setNotEmail(false)
            } else {
                setNotEmail(true)
            }
            if(username.current.value==="" || email.current.value==="" || password.current.value==="" || rePassword.current.value===""){
                setEmptyField(false);
            } else {
                setEmptyField(true)
            }
        }
    }
    return(
        <main>
            <div className="login-card">
                <div className="rooms"><h1>Rooms</h1></div>
                <div> 
                    <form className="login-form">
                        <div className="rooms2"><h1>Rooms</h1></div> 
                        {!newUser && <div style={{color: "red"}}>User already exists</div>}
                        <div className="register-row">
                            <input className="login-input" placeholder="nickname" ref={username}/>
                            <b style={{color: "red"}}>*</b>
                        </div>
                        <div className="register-row">
                            <input className="login-input" placeholder="Email Adress" ref={email} />
                            <b style={{color: "red"}}>*</b>
                        </div>
                        {!notEmail && <div style={{color: "red"}}>Invalid Email</div>}
                        <div className="register-row">
                            <input className="login-input" type="password" placeholder="Password" ref={password} />
                            <b style={{color: "red"}}>*</b>
                        </div>
                        {!samePassword && <div style={{color: "red"}}>Need to have the same password</div>}
                        <div className="register-row">
                            <input className="login-input" type="password" placeholder="Verify Password" ref={rePassword} />
                            <b style={{color: "red"}}>*</b>
                        </div>
                        {!emptyField && <div style={{color: "red"}}>Some of the fields are empty</div>}
                        <input className="login-submit" value="Register" type="submit" onClick={userRegister} />
                    </form>
                    <h5 className="login-suggest"><b className="hide370px">Have an account already? </b><span><Link to="../Login">Login</Link></span></h5>
                </div>
            </div>
        </main>
    )
}