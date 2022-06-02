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
    const [posts, setPosts] = useState([]);
    const [roomposts, setRoomposts] = useState([]);
    const {user, dispatch}  = useContext(AuthContext);

    //27-62 : Determiner le temps qui a passe depuis le moment du publication de poste et le temps actuel
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
        const prev2 = prev.filter(x=>x!==id)
        return prev2
      })
      if(chatId.length === 0) setIsChatClicked(false)
    }
    const handleDelete = async(thisId) =>{
        const savedUpdated = user.saved.filter(x=>x.id !== thisId);
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: savedUpdated}});
        localStorage.setItem("user", JSON.stringify({...user, saved: savedUpdated}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: savedUpdated})
        setRoomposts(prev=>prev.filter(x=>x._id!==thisId))
        setPosts(prev=>prev.filter(x=>x._id!==thisId))
    }
    //Amener tous les utilisateurs
    useEffect(() => {
        const fetchRoomposts = async() =>{
          const res = await axios.get("http://localhost:5000/api/roompost/allroomposts/"+user._id);
          console.log(res.data)
          setRoomposts(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          )
        }
        fetchRoomposts();
        const fetchPosts = async() =>{
          const res = await axios.get("http://localhost:5000/api/posts/allposts/"+user._id);
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
      var allposts = roomposts.concat(posts)
      

      const allpostsSaved = allposts.map(x=>{
        return(
          <div className="saved-post">
              {x.photo !== ""
                  ? <img src={"http://localhost:5000/images/" + x.photo} width={60} alt="user" />
                  : (Array.isArray(x.userId)
                      ? userImg(x.userId[0]) === "https://i.ibb.co/J25RQCT/profile.png"
                      : userImg(x.userId) === "https://i.ibb.co/J25RQCT/profile.png"
                  )
                  ? <img src={Array.isArray(x.userId) ? userImg(x.userId[0]) : userImg(x.userId)} className="profileimage" alt="user" />
                  : <img src={"http://localhost:5000/images/" + (Array.isArray(x.userId) ? userImg(x.userId[0]) : userImg(x.userId))} className="profileimage" alt="user" />
              }
              <div className="savedpost-infos">
                  <p className="overflow-saved">{x.desc !== "" ? x.desc : "No description"}</p>
                  <span className="overflow-saved">posted by <b>{userName(Array.isArray(x.userId) ? x.userId[0] : x.userId)}</b></span>
                  <small className="overflow-saved">Saved {dateTime(x.saveDate)} ago</small>
              </div>
              <div className="saved-edit-buttons">
                  <Link to={Array.isArray(x.userId) ? "../roompost/"+x._id : "../posts/"+x._id}><AiOutlineEye style={{cursor: "pointer"}}/></Link>
                  <AiFillDelete style={{cursor: "pointer"}} onClick={()=>handleDelete(x._id)} />
              </div>
          </div>
        )
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
                {allpostsSaved.length !== 0 
                  ? allpostsSaved
                  : <h3>How Empty!</h3>
                }
            </div>
        </>
    )
}