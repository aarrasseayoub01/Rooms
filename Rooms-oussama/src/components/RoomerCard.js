import {React, useState, useEffect } from "react";
import axios from "axios"

export default function RoomerCard(props) {
    const [title, setTitle] = useState("")
    useEffect(() => {
        const title = async () => {
              const res = await axios.get("http://localhost:5000/api/user/"+props.userId)
              setTitle(res.data.username)
        }
        title()
    })
    if(title!==""){

    return(
        <div className="roomer-card">
            <div>
                <img className="room-cursor room-card-img" src={props.img} />
            </div>
            <div className="room-card-text">
                <h3 className="room-cursor" style={{padding: "0px"}}>{title}</h3>
                {/* <p style={{padding: "0px"}}>{props.roomers.length} Roomers</p> */}
            </div>
        </div>
    )
    } else{
        return null
    }
} 