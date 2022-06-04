import {React, useContext} from "react"
import { AuthContext } from "../Context/authContext";

export default function ChatMessage(props) {

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
    if(props.msg!==undefined){
    if(props.msg.sender!==user.username){    
        return(
            <div className="sender-message">
                <span className="sender-message-content">{props.msg.text}</span>
                <small>{dateTime(props.msg.date)}hh</small>
            </div>
        )
    }else{
        return(
            <div className="user-message">
                <span className="user-message-content">{props.msg.text}</span>
                <small>{dateTime(props.msg.date)}</small>
            </div>
        )
    }} else{
        return null
    }
}