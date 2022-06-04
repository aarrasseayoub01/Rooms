import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCloseCircle, AiOutlineSend } from "react-icons/ai";
import { AuthContext } from "../Context/authContext";
import ChatMessage from "./ChatMessage";
import { Link } from "react-router-dom";


export default function Chatbox(props) {
const [conv, setConv] =useState([]);
const [msgs, setMsgs] =useState([]);
const [msg1, setMsg1] =useState([]);
const [users, setUsers] = useState([]);
const { user } = useContext(AuthContext); 
   
useEffect( () => {
    const fetchConv = async () => {
        const conv = await axios.get("http://localhost:5000/api/conv/find/"+props.username+"/"+user.username);
        setConv(conv.data)
        const msg = await axios.get("http://localhost:5000/api/msg/"+conv.data._id);
        setMsgs(msg.data)
    }
    fetchConv();
}, [user, msg1])

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
    function userId(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i].username===thisId){
                return(users[i]._id)
            }
        }
    }
    //Detetmine la photo de profil d'utilisateur depuis son idetifiant
    function userImg(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i].username===thisId){
                return(users[i].picture)
            }
        }
    }

    
        

    const handleSend = async ()=>{
        const conv = await axios.get("http://localhost:5000/api/conv/find/"+props.username+"/"+user.username);
        await axios.post("http://localhost:5000/api/msg/", {conversationId:conv.data._id,sender:user.username,text:msg1, date:new Date()});
        setMsg1("")
    }

    const handleChange = (e) => {
        setMsg1(e.target.value)
    }

    const chatMsg = msgs.map(msg=>{
        return(
            <>
                <ChatMessage msg={msg} />
            </>
        )
    })
    return(
        <div className="chatbox">
            <div className="chatbox-header">
                <Link to={"/"+userId(props.username)}>
                {userImg(props.username)==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={userImg(props.username)} 
                    />
                    : <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={"http://localhost:5000/images/"+userImg(props.username)} 
                    />  
                }
                </Link>
                <Link className="chatbox-sender" to={"/"+userId(props.username)}><h3 className="chatbox-sender">{props.username}</h3></Link>
                <AiFillCloseCircle onClick={()=>props.ShutChat(props.username)} size={20} style={{cursor:"pointer"}}/>
            </div>
            <div className="chatbox-message">
                {chatMsg.length!==0 ? chatMsg : "Soyez le prmeier a envoyer un message"}
            </div>
            <div className="add-message">
                <textarea className="add-message-textarea" placeholder="Type your Message" onChange={handleChange} value={msg1}/>
                <AiOutlineSend size={20} style={{cursor:"pointer"}} onClick={handleSend}/>
            </div>
        </div>
    )
}