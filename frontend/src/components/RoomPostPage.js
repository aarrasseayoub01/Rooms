import React, { useContext, useState, useEffect } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "./Navbar";
// import { postCall } from "../apiCalls";
import axios from "axios"
import { AuthContext } from "../Context/authContext";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import Message from "./Message";
import { AiFillMessage } from "react-icons/ai";
import Chatbox from "./Chatbox";
import RoomPost from "./RoomPost";

export default function RoomPostPage(props) {
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgClicked] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [chatId, setChatId] = useState([]);
  const [posts, setPosts] = useState({});
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const [commentNotes, setCommentNotes] = useState([]);
  const [room, setRoom] = useState({})
  const { user } = useContext(AuthContext);

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

  //Amener tous les publications du "backend"
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/roompost/" + props.id);
      setPosts(res.data);
    };
    fetchPosts();
    const fetchRoom = async () => {
      const res = await axios.get("http://localhost:5000/api/room/"+props.roomId)
      setRoom(res.data)
    }
    
      fetchRoom()
    
    
    const fetchLikes = async () => {
      const res = await axios.get("http://localhost:5000/api/roompost/" + props.id);
      const likeNotif = []
           likeNotif.push(res.data.likes.map(x=>[...x, 'like']))
      
      setLikeNotes(
        likeNotif.flat().sort((p1, p2) => {
          return new Date(p2[1]) - new Date(p1[1]);
        })
      );
    };
    fetchLikes();
    const fetchDislikes = async () => {
      const res = await axios.get("http://localhost:5000/api/roompost/" + props.id);
      const dislikeNotif = []
      
           dislikeNotif.push(res.data.dislikes.map(x=>[...x, 'dislike']))
      
      setDislikeNotes(
        dislikeNotif.flat().sort((p1, p2) => {
          return new Date(p2[1]) - new Date(p1[1]);
        })
      );
    };
    fetchDislikes();
    const fetchComments = async () => {
      const res = await axios.get("http://localhost:5000/api/roompost/" + props.id);
      const commentNotif = []
     
           commentNotif.push(res.data.comments.map(x=>{return {...x, type:'dislike'}}))
      
      setCommentNotes(
        commentNotif.flat().sort((p1, p2) => {
          return new Date(p2[1]) - new Date(p1[1]);
        })
      );
    };
    fetchComments();
  }, [user._id, props.id]);
  const notif=likeNotes.concat(dislikeNotes)
  const notiff=notif.concat(commentNotes)
  const notif1 = notiff.sort((p1, p2) => {
    var a;
    if(Array.isArray(p1) && Array.isArray(p2)) {
      a = new Date(p2[1]) - new Date(p1[1])
    }
    if(Array.isArray(p1) && !Array.isArray(p2)) {
      a = new Date(p2.date) - new Date(p1[1])
    }
    if(!Array.isArray(p1) && !Array.isArray(p2)) {
      a = new Date(p2.date) - new Date(p1.date)
    }
    if(!Array.isArray(p1) && Array.isArray(p2)) {
      a = new Date(p2[1]) - new Date(p1.date)
    }
    return a;
  })
  const notif2 = notif1.map(x=>{
    return(
          <Notification 
            key={x.date}
            x={x}
          />
    )
  })
  if(posts.likes!==undefined && room.followers!==undefined){
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
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="feed">
            <RoomPost
              key={posts._id}
              id={posts._id}
              desc={posts.desc}
              img={posts.photo}
              date={posts.date}
              userId={posts.userId}
              roomId={posts.room}
              like={posts.likes}
              disLike={posts.dislikes}
              comments={posts.comments}
              post={posts}
              roomers={posts.roomers}
              sharer={""}
              shareDesc={""}
              singlepost={true}

                vote={posts.likeCount}
                followers={room.followers}
                admins={room.userId}
            //   shareDate={x.shareDate}
          />
            </div>
            </motion.dev>
            </AnimatePresence>
        </>
    )
        } else {
            return <div></div>
        }
}