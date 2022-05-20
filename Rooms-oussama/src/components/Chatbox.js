import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiOutlineSend } from "react-icons/ai";
import { setAppElement } from "react-modal";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import ChatMessage from "./ChatMessage";


export default function Chatbox(props) {
const [conv, setConv] =useState([]);
const [msgs, setMsgs] =useState([]);
const [msg1, setMsg1] =useState([]);
const [a, setA] = useState(false)
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

    const handleSend = async ()=>{
        const conv = await axios.get("http://localhost:5000/api/conv/find/"+props.username+"/"+user.username);
        await axios.post("http://localhost:5000/api/msg/", {conversationId:conv.data._id,sender:props.username,text:msg1, date:new Date()});
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
                <h3 className="chatbox-sender">{props.username}</h3>
                <AiFillCloseCircle onClick={()=>props.ShutChat(props.username)} size={20} style={{cursor:"pointer"}}/>
            </div>
            <div className="chatbox-message">
                {chatMsg}
            </div>
            <div className="add-message">
                <textarea className="add-message-textarea" placeholder="Type your Message" onChange={handleChange} value={msg1}/>
                <AiOutlineSend size={20} style={{cursor:"pointer"}} onClick={handleSend}/>
            </div>
        </div>
    )
}