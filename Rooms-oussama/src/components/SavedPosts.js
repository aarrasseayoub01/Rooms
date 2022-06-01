import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import { AuthContext } from "../Context/authContext"

import Navbar from "./Navbar";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import { AiFillDelete, AiFillMessage, AiOutlineEye } from "react-icons/ai";
import Message from "./Message";
import Chatbox from "./Chatbox";
import { Link } from "react-router-dom";

export default function SavedPosts() {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const [isMsgClicked, setIsMsgClicked] = useState(false);
    const [isChatClicked, setIsChatClicked] = useState(false);
    const [chatId, setChatId] = useState([]);
    const [likeNotes, setLikeNotes] = useState([]);
    const [dislikeNotes, setDislikeNotes] = useState([]);
    const [commentNotes, setCommentNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [posts, setPosts] = useState([]);
    const [roomposts, setRoomposts] = useState([]);
    const {user, dispatch}  = useContext(AuthContext);
    const [saved, setSaved] = useState(roomposts);

    //gerer la fenetre des notifications
    function handleNotif() {
      setIsNotifClicked(prev=>!prev)
      setIsMsgClicked(false)
    }
    //gerer la fenetre des messages
    function handleMessage() {
      setIsNotifClicked(false)
      setIsMsgClicked(prev=>!prev)
    }
    //faire apparaitre les fenetres de chat
    function handleChat(id) {
      setChatId(prev=>(!prev.includes(id) ? [...prev,id] : [...prev]))
      setIsChatClicked(true)
    }
    //cacher les fenetres de chat
    function ShutChat(id){
      setChatId(prev=>{
        const prev2 = prev.filter(x=>x!=id)
        return prev2
      })
      if(chatId.length === 0) setIsChatClicked(false)
    }
    const handleDelete = async(thisId) =>{
        const savedUpdated = user.saved.filter(x=>x.id !== thisId);
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: savedUpdated}});
        localStorage.setItem("user", JSON.stringify({...user, saved: savedUpdated}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: savedUpdated})
        setSaved(savedUpdated)
    }
    //Amener tous les utilisateurs
    useEffect(() => {
        const fetchRoomposts = async() =>{
            const res = await axios.get("http://localhost:5000/api/roompost/allroomposts/"+user._id);
            setRoomposts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            )
        }
        fetchRoomposts();
        const fetchPosts = async() =>{
            const res = await axios.get("http://localhost:5000/api/posts/allposts");
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            )
        }
        fetchPosts();
        const fetchUsers = async () => {
            const res = await axios.get("http://localhost:5000/api/user/allusers");
            setUsers(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            )
        };
        fetchUsers();
        const fetchRooms = async () => {
          const res = await axios.get("http://localhost:5000/api/room/allrooms");
          setRooms(
              res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
              })
          )};
          fetchRooms();
        const fetchLikes = async () => {
            const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
            const likeNotif = []
            res.data.forEach(post=>{
                 likeNotif.push(post.likes.map(x=>[...x, 'like']))
            })
            setLikeNotes(
              likeNotif.flat().sort((p1, p2) => {
                return new Date(p2[1]) - new Date(p1[1]);
              })
            );
          };
          fetchLikes();
          const fetchDislikes = async () => {
            const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
            const dislikeNotif = []
            res.data.forEach(post=>{
                 dislikeNotif.push(post.dislikes.map(x=>[...x, 'dislike']))
            })
            setDislikeNotes(
              dislikeNotif.flat().sort((p1, p2) => {
                return new Date(p2[1]) - new Date(p1[1]);
              })
            );
          };
          fetchDislikes();
          const fetchComments = async () => {
            const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
            const commentNotif = []
            res.data.forEach(post=>{
                 commentNotif.push(post.comments.map(x=>{return {...x, type:'dislike'}}))
            })
            setCommentNotes(
              commentNotif.flat().sort((p1, p2) => {
                return new Date(p2[1]) - new Date(p1[1]);
              })
            );
          };
          fetchComments();
    }, [user._id]);
    const notif=likeNotes.concat(dislikeNotes)
    const notiff=notif.concat(commentNotes)
    const notif1 = notiff.sort((p1, p2) => {
      if(Array.isArray(p1) && Array.isArray(p2)) {
        return new Date(p2[2]) - new Date(p1[2])
      }
      if(Array.isArray(p1) && !Array.isArray(p2)) {
        return new Date(p2.date) - new Date(p1[2])
      }
      if(!Array.isArray(p1) && !Array.isArray(p2)) {
        return new Date(p2.date) - new Date(p1.date)
      }
      if(!Array.isArray(p1) && Array.isArray(p2)) {
        return new Date(p2[2]) - new Date(p1.date)
      }
    })
    const notif2 = notif1.map(x=>{
      return(
            <Notification 
              key={x.date}
              x={x}
            />
      )
    })
    //Detetmine le nom d'utilisateur depuis son idenifiant
    function userName(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].username)
            }
        }
    }
    //Detetmine la photo de profil d'utilisateur depuis son idetifiant
    function userImg(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].picture)
            }
        }
    }
    const savedroomposts = roomposts.map(x=>{
            return(
                <div className="saved-post">
                    {x.photo !== ""
                        ? <img src={"http://localhost:5000/images/" + x.photo} width={60}/>
                        : (userImg(x.userId[0]) === "https://i.ibb.co/J25RQCT/profile.png"
                            ? <img src={userImg(x.userId[0])} className="profileimage" />
                            : <img src={"http://localhost:5000/images/" + userImg(x.userId[0])} className="profileimage" />
                        )
                    }
                    <div className="savedpost-infos">
                        <p className="overflow-saved">{x.desc !== "" ? x.desc : "No description"}</p>
                        <b className="overflow-saved">{userName(x.userId[0])}</b>
                        <small className="overflow-saved">Saved 11h ago</small>
                    </div>
                    <div className="saved-edit-buttons">
                        <Link to={"../roompost/"+x.id}><AiOutlineEye style={{cursor: "pointer"}}/></Link>
                        <AiFillDelete style={{cursor: "pointer"}} onClick={()=>handleDelete(x.id)} />
                    </div>
                </div>
            )
        }
    )
    //Retourne la publication depuis son idenifiant
    function post(thisId) {
        for (let i=0;i<posts.length;i++){
            if(posts[i]._id===thisId){
                return(posts[i])
            }
        }
    }
    const savedposts = saved.map(x=>{
        if(x.type==="post" && post(x.id)!==undefined){
            return(
                <div className="saved-post">
                    {post(x.id).photo !== ""
                        ? <img src={"http://localhost:5000/images/" + post(x.id).photo} width={60}/>
                        : (userImg(post(x.id).userId) === "https://i.ibb.co/J25RQCT/profile.png"
                            ? <img src={userImg(post(x.id).userId)} className="profileimage" />
                            : <img src={"http://localhost:5000/images/" + userImg(post(x.id).userId)} className="profileimage" />
                        )
                    }
                    <div className="savedpost-infos">
                        <p className="overflow-saved">{post(x.id).desc !== "" ? post(x.id).desc : "No description"}</p>
                        <span className="overflow-saved">posted by <b>{userName(post(x.id).userId)}</b></span>
                        <small className="overflow-saved">Saved 11h ago</small>
                    </div>
                    <div className="saved-edit-buttons">
                        <Link to={"../posts/"+x.id}><AiOutlineEye style={{cursor: "pointer"}}/></Link>
                        <AiFillDelete style={{cursor: "pointer"}} onClick={()=>handleDelete(x.id)} />
                    </div>
                </div>
            )
        }
    })
    const test = chatId.map(x=><Chatbox key={x} username={x} ShutChat={ShutChat} />)
    return(
        <>
            <Navbar handleNotif={handleNotif} handleMessage={handleMessage} />
            {isNotifClicked &&
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <div className="notification">
                <div className="notif-bell"><MdNotificationsActive /></div>
                {notif2.length !==0 ? notif2 : <h5>How Empty!</h5>}
              </div>
              </motion.dev>
              </AnimatePresence>
            }
            {isMsgClicked &&
              <AnimatePresence>
              <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="chat-message">
                  <div className="notif-bell"><AiFillMessage /></div>
                  <Message id={1} handleChat={handleChat}/>
                </div>
              </motion.dev>
              </AnimatePresence>
            }
            {isChatClicked &&
              <AnimatePresence>
              <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="chatboxes">
                  {test.length <= 3 ? test : test.slice(0, 3)}
                </div>
              </motion.dev>
              </AnimatePresence>
            }

            <div className="savedposts-banner"><h1>Saved Posts</h1></div>
            <div className="savedposts-panel">
                {savedroomposts}
                <h1>-----------</h1>
                {savedposts}
            </div>
        </>
    )
}