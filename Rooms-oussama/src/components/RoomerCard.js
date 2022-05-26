import {React, useState, useEffect } from "react";
import axios from "axios"

export default function RoomerCard(props) {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        const title = async () => {
              const res = await axios.get("http://localhost:5000/api/user/"+props.userId)
              setTitle(res.data.username)
              setPhoto(res.data.picture)
        }
        title();
    })
    if(title!==""){

    return(
        <div className="roomer-card">
            <div>
                {photo === "https://i.ibb.co/J25RQCT/profile.png"
                    ? <img className="room-cursor room-card-img" src={photo}/>
                    : <img className="room-cursor room-card-img" src={"http://localhost:5000/images/" + photo }/>
                }
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