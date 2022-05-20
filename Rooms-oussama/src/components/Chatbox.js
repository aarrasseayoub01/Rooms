import axios from "axios";
import React, { useContext } from "react";
import { AiFillCloseCircle, AiOutlineSend } from "react-icons/ai";
import { useState, useEffect } from "react";
import { AuthContext } from "../Context/authContext";
import ChatMessage from "./ChatMessage";
import { Link } from "react-router-dom";


export default function Chatbox(props) {
    const { user } = useContext(AuthContext); 
    const [users, setUsers] = useState([]);

    //Amener tous les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/user/allusers");
        setUsers(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        );
        };
        fetchUsers();
    }, []);

    //Detetmine le nom d'utilisateur depuis son idetifiant
    function userName(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].username)
            }
        }
    }
    //Detetmine la photo de profil d'utilisateur depuis son idetifiant
    function userImg(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].picture)
            }
        }
    }

    const dateTime = (date1) => {
        const d1 = Date.now();
        const d2 = new Date(date1);
        var diff= Math.abs(d1-d2);
        var date = 0;
        var dateStr = "";
        if (diff >= (1000*3600*24*365)){
            date = diff/(1000 * 3600 * 24 * 365)
            dateStr = Math.floor(date).toString() + " y"
        } else {
            if(diff >= (1000*3600*24*30)){
                date = diff/(1000*3600*24*30)
                dateStr = Math.floor(date).toString() + " m"
            } else{
                if(diff >= (1000*3600*24)){
                    date = diff/(1000*3600*24)
                    dateStr = Math.floor(date).toString() + " d"
                } else {
                    if(diff >= (1000*3600)){
                        date = diff/(1000*3600)
                        dateStr = Math.floor(date).toString() + " h"
                    } else{
                        if(diff >= (1000*60)){
                            date = diff/(1000*60)
                            dateStr = Math.floor(date).toString() + " min"
                        } else {
                            date = diff/(1000)
                            dateStr = Math.floor(date).toString() + " s"
                        }
                    }
                }
            }
        }
        return dateStr
    }
    return(
        <div className="chatbox">
            <div className="chatbox-header">
                <Link to={"/"+props.id}>
                {userImg(props.id)==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={userImg(props.id)} 
                    />
                    : <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={"http://localhost:5000/images/"+userImg(props.id)} 
                    />  
                }
                </Link>
                <Link className="chatbox-sender" to={"/"+props.id}><h3 className="chatbox-sender">{userName(props.id)}</h3></Link>
                <AiFillCloseCircle onClick={()=>props.ShutChat(props.id)} size={20} style={{cursor:"pointer"}}/>
            </div>
            <div className="chatbox-message">
                <ChatMessage sent={true} />
                <ChatMessage sent={false} />
            </div>
            <div className="add-message">
                <textarea className="add-message-textarea" placeholder="Type your Message" />
                <AiOutlineSend size={20} style={{cursor:"pointer"}} />
            </div>
        </div>
    )
}