import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/authContext";

export default function Messagebox(props){
    const [conv, setConv] =useState([]);
    const [msgs, setMsgs] =useState([]);
    const { user } = useContext(AuthContext);

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

    useEffect( () => {
        const fetchConv = async () => {
            const conv = await axios.get("http://localhost:5000/api/conv/find/"+props.username+"/"+user.username);
            setConv(conv.data)
            const msg = await axios.get("http://localhost:5000/api/msg/"+conv.data._id);
            setMsgs(msg.data)
        }
        fetchConv();
    }, [user])
    const lastMsg = msgs.length!==0 && msgs[msgs.length-1]
    return(
        <div className="message-bodyy">
            <button onClick={()=>props.handleChat(props.username)} className="message-body">
                {props.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={props.picture} 
                    />
                    : <img 
                        width="30px" 
                        className="profileimage" 
                        alt="chat profile" 
                        src={"http://localhost:5000/images/"+props.picture} 
                    />  
                }
                <div className="message-text">
                    <b className="message-sender">{props.username}</b>
                    <span className="message-content"><small>{lastMsg ? lastMsg.sender+": "+lastMsg.text : "Soyez le prmeier a envoyer un message"}</small></span>
                </div>
                <h5 className="msg-date">{lastMsg && dateTime(lastMsg.date)}</h5>
            </button>
        </div>
    )
}