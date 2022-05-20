import React, { useContext } from "react";
import { AiFillCloseCircle, AiOutlineSend } from "react-icons/ai";
import { AuthContext } from "../Context/authContext";
import ChatMessage from "./ChatMessage";


export default function Chatbox(props) {
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
    return(
        <div className="chatbox">
            <div className="chatbox-header">
                <h3 className="chatbox-sender">{props.id}</h3>
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