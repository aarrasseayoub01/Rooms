import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/authContext";
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";

export default function SearchedRoom(props) {
    const {user} = useContext(AuthContext)
    const [rooms, setRooms] = useState([]);
    const [followed, setFollowed] = useState(props.followers.includes(user._id));

    useEffect(() => {
        const fetchRooms = async () => {
        const res = await axios.get("http://localhost:5000/api/room/allrooms");
        setRooms(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        );
        };
        fetchRooms();
    }, []);



    
    const handleFollow =  async () => {
        setFollowed(prev=>!prev)
        const followersList = props.followers;
        if(!followersList.includes(user._id)){
            followersList.push(user._id)
        } else {
            var index = followersList.indexOf(user._id)
            followersList.splice(index,1)
        }
        
        await axios.put(`http://localhost:5000/api/room/${props.id}`, {...props.x, followers: followersList})
       
    }
    const myFriends = user.following.filter(x=>user.followers.includes(x));
    const Roomers = props.followers.concat(props.admins);
    const mutualFriends = Roomers.filter(x=>myFriends.includes(x));
    //Affiche les utlisateurs trouve avec le meme nom recherche
    return(
        <div >
            <div className="searched-user">
                <Link to={"../room/"+props.id}>
                {props.image==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img className="searchimage" src={props.image} alt="User Profile" />
                    : <img className="searchimage" src={"http://localhost:5000/images/" + props.cover} alt="User Profile" />
                }</Link>
                <div className="user-propreties">
                    <Link to={"../room/"+props.id} className="link-username"><b className="searched-username">{props.title}</b></Link>
                    <p>{(props.admins.includes(user._id)
                        ? "Your Room"
                        // : checkFriendship(props.id, user.following, user.followers)
                        : (props.followers.includes(user._id)
                            ? "Followed"
                            : "Not Followed"
                        )
                        )}</p>
                    <small>{mutualFriends.length} of your friends followed</small>
                </div>
                <div className="searched-flex">
                    {!(user._id === props.id) &&
                        <>
                            <div className="profile-add">
                                {!props.admins.includes(user._id) &&
                                    (!followed
                                        ? <AiOutlinePlusCircle size={30} onClick={handleFollow}/>
                                        : <AiFillPlusCircle size={30} onClick={handleFollow}/>
                                    )
                                }
                                <b onClick={handleFollow}>{!props.admins.includes(user._id) && (props.followers.includes(user._id) ? "Unfollow" : "Follow")}</b>
                            </div>
                        </>
                    }
                </div>
            </div>
            <hr />
        </div>
    )
}