import React, { useContext, useState, useEffect } from "react";
import logo from "../images/logo.png"
import { AiFillMessage, AiOutlineClose } from "react-icons/ai";
import { MdNotificationsActive } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import SearchedUser from "./SearchedUser";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MiniSearchedUser from "./MiniSearchedUser";

export default function Navbar(props) {
  const [thisValue, setThisValue] = useState("");
  const {user, dispatch} = useContext(AuthContext);
  const hideStyle = {
    display: "none"
  }
  const showStyle = {
    display: "block"
  }

  const [style, setStyle] = useState(hideStyle)
  //Si on clique sur le boutton de "Logout", on supprime l'utilisateur de localStorage
  function handleLogout() {
    dispatch({ type: "LOGIN_SUCCESS", payload: null});
    localStorage.removeItem("user")
  }
  //Afficher le button de recherche seulement si il y a de texte dans le barre de recherche
  function handleShow(e){
    setThisValue(e)
    if (e.length!=0){
      setStyle(showStyle)
    } else {
      setStyle(hideStyle)
    }
  }
  //Supprimer le texte dans la barre de recherche
  function handleClear() {
    setThisValue("")
    setStyle(hideStyle)
  }
  
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/user/allusers");
    setUsers(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
    )};
    fetchUsers();
    }, [])
  
  const searchedUsers = users.map(x=>{
    return(thisValue!=="" && x.username.toLowerCase().includes(thisValue.toLowerCase()) //Rendre le recherche insensible au majuscules et miniscules
        ?(<AnimatePresence>
        <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <MiniSearchedUser key={x._id} id={x._id} username={x.username} image={x.picture} />
            </motion.dev>
        </AnimatePresence>):null)
    }
  )
  return(
        <div className="navbar">
            <ul className="navbar-list">
                <Link to="../">
                  <li className="navbar-li">
                    <img className="navbar-logo" src={logo} />
                  </li>
                </Link>
                <li className="navbar-searched">
                  <div className="navbar-li">
                    <Link to={"/search/"+thisValue}><BsSearch style={style} className="search-icon"/></Link>
                    <input onChange={(e)=>handleShow(e.target.value)} value={thisValue} className="navbar-search" placeholder="Search Rooms..." />
                    <AiOutlineClose style={style} className="search-icon" onClick={handleClear}/>
                  </div>
                  {searchedUsers}
                </li>
                <li className="navbar-li"></li>
                <li className="navbar-li"></li>
                <li className="navbar-li">
                    <div className="navbar-notice">
                        <AiFillMessage onClick={props.handleMessage} style={{cursor : "pointer"}} className="navbar-chat"/>
                        <MdNotificationsActive onClick={props.handleNotif} style={{cursor : "pointer"}} className="navbar-notif" />
                    </div>
                </li>
                <li className="dropdown">
                    <Link  className="link-username" to="../Profile">
                      <div className="navbar-link">
                        {user.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                            ? <img className="navbar-profileimage" src={user.picture} />
                            : <img className="navbar-profileimage" src={"http://localhost:5000/images/" + user.picture} />
                        }
                        <p className="navbar-name">{user.username}</p>
                      </div>
                    </Link>
                    <button className="logout" onClick={handleLogout}>Log Out</button>
                </li>
            </ul>
        </div>
  )
} 