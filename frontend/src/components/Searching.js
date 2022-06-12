import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import { AuthContext } from "../Context/authContext"

import Navbar from "./Navbar";
import SearchedUser from "./SearchedUser";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import { AiFillMessage } from "react-icons/ai";
import Message from "./Message";
import Chatbox from "./Chatbox";
import SearchedRoom from "./SearchedRoom";

export default function Searching(props) {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const [isMsgClicked, setIsMsgClicked] = useState(false);
    const [isChatClicked, setIsChatClicked] = useState(false);
    const [chatId, setChatId] = useState([]);
    const [likeNotes, setLikeNotes] = useState([]);
    const [dislikeNotes, setDislikeNotes] = useState([]);
    const [commentNotes, setCommentNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const {user}  = useContext(AuthContext);

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

    //Amener tous les utilisateurs
    useEffect(() => {
        const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/user/allusers");
        setUsers(
          Array.isArray(res.data) && (
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          )
        )};
        fetchUsers();
        const fetchRooms = async () => {
          const res = await axios.get("http://localhost:5000/api/room/allrooms");
          setRooms(
            Array.isArray(res.data) && (
              res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt);
              })
            )
          )};
          fetchRooms();
        const fetchLikes = async () => {
            const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
            const likeNotif = []
            Array.isArray(res.data) && (
              res.data.forEach(post=>{
                 likeNotif.push(post.likes.map(x=>[...x, 'like']))
              })
            )
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
            Array.isArray(res.data) && (
              res.data.forEach(post=>{
                 dislikeNotif.push(post.dislikes.map(x=>[...x, 'dislike']))
              })
            )
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
            Array.isArray(res.data) && (
              res.data.forEach(post=>{
                 commentNotif.push(post.comments.map(x=>{return {...x, type:'dislike'}}))
              })
            )
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
      var a;
      if(Array.isArray(p1) && Array.isArray(p2)) {
        a = new Date(p2[2]) - new Date(p1[2])
      }
      if(Array.isArray(p1) && !Array.isArray(p2)) {
        a = new Date(p2.date) - new Date(p1[2])
      }
      if(!Array.isArray(p1) && !Array.isArray(p2)) {
        a = new Date(p2.date) - new Date(p1.date)
      }
      if(!Array.isArray(p1) && Array.isArray(p2)) {
        a = new Date(p2[2]) - new Date(p1.date)
      }
      return a;
    })
    const notif2 = notif1.map(x=>{
      return(
            <Notification 
              key={x.date}
              x={x}
            />
      )})
    var searchedUsers = users.map(x=>{
        return(x.username.toLowerCase().includes(props.userId.toLowerCase()) //Rendre le recherche insensible au majuscules et miniscules
            ?(<AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <SearchedUser key={x._id} id={x._id} username={x.username} image={x.picture} followers={x.followers} following={x.following} />
                </motion.dev>
            </AnimatePresence>):null)
        }
    )
    searchedUsers = searchedUsers.filter(x=>x)
    var searchedRooms;
    Array.isArray(rooms) && (searchedRooms = rooms.map(x=>{
      return(x.title.toLowerCase().includes(props.userId.toLowerCase()) //Rendre le recherche insensible au majuscules et miniscules
            ?(<AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <SearchedRoom 
                  key={x._id} 
                  id={x._id}
                  title={x.title}
                  cover={x.cover}
                  admins={x.userId} 
                  followers={x.followers}
                  room={x}
                />
                </motion.dev>
            </AnimatePresence>):null)
    }))
    searchedRooms = searchedRooms.filter(x=>x)
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
            <div className="post">
                <h2 className="search-title">People</h2>
                <div className="search-div">
                    {searchedUsers.length !==0
                      ? searchedUsers
                      : <h3>Nothing Found !</h3>
                    }
                </div>
                <h2 className="search-title">Rooms</h2>
                <div className="search-div">
                    {searchedRooms.length !==0
                      ? searchedRooms
                      : <h3 style={{paddingBottom: "20px"}}>Nothing Found !</h3>
                    }
                </div>
            </div>
        </>
    )
}