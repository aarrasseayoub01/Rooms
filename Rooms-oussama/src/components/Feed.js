import React, { useContext, useState, useEffect } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "./Navbar";
import Post from "./Post";
// import { postCall } from "../apiCalls";
import axios from "axios"
import { AuthContext } from "../Context/authContext";
import AddPost from "./AddPost";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import { AiFillCloseCircle, AiFillMessage, AiOutlineSend } from "react-icons/ai";
import Message from "./Message";
import Chatbox from "./Chatbox";

export default function Feed() {
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgClicked] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [chatId, setChatId] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const [commentNotes, setCommentNotes] = useState([]);
  const { user } = useContext(AuthContext);

  function handleNotif() {
    setIsNotifClicked(prev=>!prev)
    setIsMsgClicked(false)
  }
  function handleMessage() {
    setIsNotifClicked(false)
    setIsMsgClicked(prev=>!prev)
  }
  function handleChat(id) {
    setChatId(prev=>[...prev, id])
    setIsChatClicked(true)
  }
  function ShutChat(id){
    setChatId(prev=>{
      const prev2 = prev.filter(x=>x!=id)
      return prev2
    })
    if(chatId.length === 0) setIsChatClicked(false)
  }
  //Amener tous les publications du "backend"
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.date) - new Date(p1.date);
        })
      );
    };
    fetchPosts();
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

  //Envoyer les publications chacune a sa composante avec ses "props"
  const myPosts = posts.map(x=>{
    if(!Array.isArray(x)){    
      return(
          <Post 
              key={x._id}
              id={x._id}
              desc={x.desc}
              img={x.photo}
              date={x.date}
              userId={x.userId}
              room={x.room}
              like={x.likes}
              disLike={x.dislikes}
              comments={x.comments}
              post={x}
              roomers={x.roomers}
              sharer={x.sharer}
              shareDesc={x.shareDesc}
              shareDate={x.shareDate}
          />
      )
    } else {
      return (x.map(x=>{
        return (
            <Post 
                key={x._id}
                id={x._id}
                desc={x.desc}
                img={x.photo}
                date={x.date}
                userId={x.userId}
                room={x.room}
                like={x.likes}
                disLike={x.dislikes}
                comments={x.comments}
                post={x}
            />
        )
      }))
    }})
  const test = chatId.map(x=><Chatbox key={x} id={x} ShutChat={ShutChat} />)
  return(
        <>
            <Navbar handleNotif={handleNotif} handleMessage={handleMessage} />
            {isNotifClicked &&
              
             
                <div className="notification">
                  <div className="notif-bell"><MdNotificationsActive /></div>
                  {notif2.length !==0 ? notif2 : <h5>How Empty!</h5>}
                </div>
              
            }
            {isMsgClicked &&
                <div className="chat-message">
                  <div className="notif-bell"><AiFillMessage /></div>
                  <Message handleChat={handleChat}/>
                </div>
            }
            {isChatClicked &&
              
                <div className="chatboxes">
                  {test.length <= 3 ? test : test.slice(0, 3)}
                  {/* {test[chatId]} */}
                </div>
              
            }
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="feed">
                <AddPost /> 
                {myPosts.length!==0 && myPosts }
            </div>
            </motion.dev>
            </AnimatePresence>
        </>
    )
}