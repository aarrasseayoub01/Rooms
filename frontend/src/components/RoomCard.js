import axios from "axios";
import {React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RoomCard(props) {
    // const [title, setTitle] = useState("")
    // useEffect(() => {
    //     const title = async () => {
    //           const res = await axios.get("http://localhost:5000/api/user/"+props.id)
    //           setTitle(res.data.username)
    //     }
    //     title()
    // })
    console.log(props)
    if(props.title!==""){
    return(
        <div className="room-card">
            <Link to={"../room/"+props.id}>
                {props.cover !== "https://i.ibb.co/MVjMppt/cover.jpg" 
                    ? <img className="room-card-img" src={"http://localhost:5000/images/" + props.cover} alt="" />
                    : <img className="room-card-img" src={props.cover} alt="" />
                }
            </Link>
            <div className="room-card-text">
                <Link to={"../room/"+props.id} className="text-decoration"><h3 className="room-cursor" style={{padding: "0px"}}>{props.title}</h3></Link>
                <p style={{padding: "0px"}}>{props.followers.length + props.userId.length} Roomers</p>
            </div>
        </div>
    )
}
else {
    return null
}
} 