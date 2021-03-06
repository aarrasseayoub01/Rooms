import React, { useContext, useRef, useState } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../Context/authContext";
import {Link} from "react-router-dom"
import axios from "axios"
export default function Login() {
    const [wrongEmail, setWrongEmail] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const email= useRef();
    const password = useRef();
    const { dispatch } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault();
        const allUsers = await axios.get("http://localhost:5000/api/user/allusers") //Amener tous les utilisateurs
        const email1 = allUsers.data.filter(user=>user.email===email.current.value) //Verifier les utilisateurs ayant le meme email tappe
        if(email1.length === 0) {
            //Si il n'y a pas de correspondance, Afficher une erreur.
            setWrongEmail(true)
        } else {
            const valid = await axios.post("http://localhost:5000/api/user/check", {pw1:password.current.value, pw2:email1[0].password})
            //Verifier dans le backend si le mot de passe donne est celui avec lequel l'email est enregistre
            if(!valid.data.status){
                //Si il n'y a pas de correspondance, Afficher une erreur.
                setWrongPassword(true)
            } else{
                //Si tous marche bien, Effectuer l'authentification'
                loginCall({email: email.current.value, password: password.current.value}, dispatch);
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
                        <div className="register-row">
                            <input className="login-input" placeholder="Email Adress" ref={email}/>
                            <b style={{color: "red"}}>*</b>
                        </div>
                        {wrongEmail && <div style={{color: "red"}}>Email not found</div>}
                        <div className="register-row">
                            <input className="login-input" type="password" placeholder="Password" ref={password} />
                            <b style={{color: "red"}}>*</b>
                        </div>
                        {!wrongEmail && wrongPassword && <div style={{color: "red"}}>Wrong password</div>}
                        <input className="login-submit" value="Login" type="submit" onClick={handleLogin}/>
                    </form>
                    <h5 className="login-suggest"><span className="hide370px">Don't have an account?</span><span><Link to="../Register">Register</Link></span></h5>
                </div>
            </div>
        </main>
    )
}