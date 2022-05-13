import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/authContext";
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";

export default function SearchedUser(props) {
    const {user} = useContext(AuthContext)
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/user/allusers");
        setUsers(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
        );
        };
        fetchUsers();
    }, []);


    function getUser(thisId){
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return users[i]
            }
        }
    }

    //Detetmine le nom d'utilisateur depuis son idetifiant
    function userName(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return(users[i].username)
            }
        }
    }
    const [isFollowed, setIsFollowed] = useState(user.following.includes(userName(props.id)))
    const [Followed, setFollowed] = useState(user.following.includes(userName(props.id)) ? "Unfollow" : "Follow")
    
    const handleFollow =  async () => {
        const followingList = user.following;
        const followersList = getUser(props.id).followers;
        if(!followingList.includes(userName(props.id))){
            followingList.push(userName(props.id))
        } else {
            var index = followingList.indexOf(userName(props.id))
            followingList.splice(index,1)
        }
        if(!followersList.includes(user.username)){
            followersList.push(user.username)
        } else {
            var index = followersList.indexOf(user.username)
            followersList.splice(index,1)
        }
        setIsFollowed(prev=>!prev)
        setFollowed(prev=>{
            if(prev == "Unfollow"){
                return "Follow"
            } else {
                return "Unfollow"
            }
        })
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, following: followingList})
        await axios.put(`http://localhost:5000/api/user/${props.id}`, {...getUser(props.userId), followers: followersList})
    } 
    //Affiche les utlisateurs trouve avec le meme nom recherche
    return(
        <div >
            <div className="searched-user">
                <Link to={"../"+props.id}><img src={"http://localhost:5000/images/"+props.image} className="searchimage" /></Link>
                <div className="user-propreties">
                    <Link to={"../"+props.id} className="link-username"><b className="searched-username">{props.username}</b></Link>
                    <p>Friend</p>
                    <small>23 common friends</small>
                </div>
                <div className="searched-flex">
                    {!(user._id == props.id) &&
                        <>
                            <div className="profile-add">
                                {!isFollowed 
                                    ? <AiOutlinePlusCircle size={30} onClick={handleFollow}/>
                                    : <AiFillPlusCircle size={30} onClick={handleFollow}/>
                                }
                                <b>{Followed}</b>
                            </div>
                        </>
                    }
                </div>
            </div>
            <hr />
        </div>
    )
}