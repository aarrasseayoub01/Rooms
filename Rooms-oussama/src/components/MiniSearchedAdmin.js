import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/authContext";
import { AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";

export default function MiniSearchedAdmin(props) {
    const {user, dispatch} = useContext(AuthContext)
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
        // const res = await axios.get("http://localhost:5000/api/user/"+thisId);
        // return res;

        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return users[i]
            }
        }
    }

    //Detetmine le nom d'utilisateur depuis son idetifiant
    // function userName(thisId){
    //     // const res = await axios.get("http://localhost:5000/api/user/"+thisId);
    //     // return res.username;
    //     for (let i=0;i<users.length;i++){
    //         if(users[i]._id==thisId){
    //             return(users[i].username)
    //         }
    //     }
    // }
    
    const handleFollow =  async () => {
        const followingList = user.following;
        const followersList = getUser(props.id).followers;
        
        if(!followingList.includes(props.id)){
            followingList.push(props.id)
        } else {
            var index = followingList.indexOf(props.id)
            followingList.splice(index,1)
        }
        if(!followersList.includes(user._id)){
            followersList.push(user._id)
        } else {
            var index2 = followersList.indexOf(user._id)
            followersList.splice(index2,1)
        }
        
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, following: followingList})
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, following:followingList}});
        localStorage.setItem("user", JSON.stringify({...user, following:followingList}));
        await axios.put(`http://localhost:5000/api/user/${props.id}`, {...getUser(props.id), followers: followersList})
       
    } 
    function checkFriendship(id, List1, List2){
        if(List1.includes(id)){
            if(List2.includes(id)){
                return "Friend"
            } else {
                return "Followed"
            }
        } else {
            if(List2.includes(id)){
                return "Follower"
            } else {
                return "Not friend"
            }
        }
    }
    //Affiche les utlisateurs trouve avec le meme nom recherche
    return(
            <div className="minisearched-user">
                
                {props.image==="https://i.ibb.co/J25RQCT/profile.png" 
                    ? <img className="searchimage" src={props.image} alt="User Profile" />
                    : <img className="searchimage" src={"http://localhost:5000/images/" + props.image} alt="User Profile" />
                }
                <div className="user-propreties">
                    <b onClick={()=>props.handleSetName(props.username)} className="searched-username">{props.username}</b>
                    <p>{(user._id===props.id 
                        ? "Your profile"
                        : checkFriendship(props.id, user.following, user.followers)
                        )}</p>
                    <small>23 mutual friends</small>
                </div>
            </div>
    )
}