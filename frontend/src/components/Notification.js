import React from "react";
import {Link} from "react-router-dom";


export default function Notification(props) {

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
    if(Array.isArray(props.x)){
            if(props.x[3]==="like"){  
                return(
                    <div className="notification-body">
                        <Link className="notification-body" to={"../posts/"+props.x[1]}>
                            <img className="notificationimage" alt="Notification profile" src="https://i.ibb.co/J25RQCT/profile.png" />
                            <div className="notification-text">
                                <p><b>{props.x[0]}</b> has liked your Post</p>
                                <small>{dateTime(props.x[2])}</small>
                            </div>
                        </Link>
                    </div>
                )
            }
            if(props.x[3]==="dislike"){
                return(
                    <div className="notification-body">
                        <Link className="notification-body" to={"../posts/"+props.x[1]}>
                        <img className="notificationimage" alt="Notification profile" src="https://i.ibb.co/J25RQCT/profile.png" />
                        <div className="notification-text">
                            <p><b>{props.x[0]}</b> has disliked your Post</p>
                            <small>{dateTime(props.x[2])}</small>
                        </div>
                        </Link>

                    </div>
                )
            }
    } else {
        return(
            <div className="notification-body">
                <Link className="notification-body" to={"../posts/"+props.x.postId}>
                <img className="notificationimage" alt="Notification profile" src="https://i.ibb.co/J25RQCT/profile.png" />
                <div className="notification-text">
                    <p><b>{props.x.username}</b> has commented on your Post</p>
                    <small>{dateTime(props.x.date)}</small>
                </div>
                </Link>
            </div>
        )
    }  
}