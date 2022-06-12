import {React, useState, useEffect } from "react";
import axios from "axios"
import { Link } from "react-router-dom";

export default function RoomerCard(props) {
    const [title, setTitle] = useState("");
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        const title = async () => {
              const res = await axios.get("http://localhost:5000/api/user/"+props.id)
              setTitle(res.data.username)
              setPhoto(res.data.picture)
        }
        title();
    })
    if(title!==""){

    return(
        <div className="roomer-card">
            <Link to={"../"+props.id}>
                {photo === "https://i.ibb.co/J25RQCT/profile.png"
                    ? <img className="room-cursor room-card-img" alt="" src={photo}/>
                    : <img className="room-cursor room-card-img" alt="" src={"http://localhost:5000/images/" + photo }/>
                }
            </Link>
            <div className="room-card-text">
            <Link to={"../room/"+props.id} className="text-decoration"><h3 className="room-cursor" style={{padding: "0px"}}>{title}</h3></Link>
            </div>
        </div>
    )
    } else{
        return null
    }
} 