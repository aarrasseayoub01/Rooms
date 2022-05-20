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
import Message from "./Message";
import { AiFillMessage } from "react-icons/ai";
import Chatbox from "./Chatbox";

export default function PostPage(props) {
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgClicked] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [chatId, setChatId] = useState([]);
  const [posts, setPosts] = useState({});
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const [commentNotes, setCommentNotes] = useState([]);
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
      const prev2 = prev.filter(x=>x!=id)
      return prev2
    })
    if(chatId.length === 0) setIsChatClicked(false)
  }

  //Amener tous les publications du "backend"
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/" + props.id);
      setPosts(res.data);
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
      return new Date(p2[1]) - new Date(p1[1])
    }
    if(Array.isArray(p1) && !Array.isArray(p2)) {
      return new Date(p2.date) - new Date(p1[1])
    }
    if(!Array.isArray(p1) && !Array.isArray(p2)) {
      return new Date(p2.date) - new Date(p1.date)
    }
    if(!Array.isArray(p1) && Array.isArray(p2)) {
      return new Date(p2[1]) - new Date(p1.date)
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
  if(posts.likes!==undefined){
  const test = chatId.map(x=><Chatbox key={x} id={x} ShutChat={ShutChat} />)
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
            <Post 
              key={posts._id}
              id={posts._id}
              desc={posts.desc}
              img={posts.photo}
              date={posts.date}
              userId={posts.userId}
              room={posts.room}
              like={posts.likes}
              disLike={posts.dislikes}
              comments={posts.comments}
              post={posts}
              roomers={posts.roomers}
              sharer={""}
              shareDesc={""}
              singlepost={true}
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