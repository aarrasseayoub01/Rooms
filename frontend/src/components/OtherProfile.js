import React, { useContext, useEffect, useState } from "react"
import {motion, AnimatePresence} from 'framer-motion'

import Navbar from "./Navbar"
// import cover from "../images/post1.jpg"
import { AiFillMessage, AiFillPlusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import RoomCard from "./RoomCard"
import Post from "./Post"
import axios from "axios"
import { AuthContext } from "../Context/authContext"
import { MdNotificationsActive } from "react-icons/md"
import Notification from "./Notification"
import Chatbox from "./Chatbox"
import Message from "./Message"
// import AddPost from "./AddPost"

export default function OtherProfile(props) {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const [isMsgClicked, setIsMsgClicked] = useState(false);
    const [isChatClicked, setIsChatClicked] = useState(false);
    const [chatId, setChatId] = useState([]);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [likeNotes, setLikeNotes] = useState([]);
    const [dislikeNotes, setDislikeNotes] = useState([]);
    const [commentNotes, setCommentNotes] = useState([]);
    const {user, dispatch}  = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    
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
          const prev2 = prev.filter(x=>x!==id)
          return prev2
        })
        if(chatId.length === 0) setIsChatClicked(false)
      }

    function getUser(thisId){
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return users[i]
            }
        }
    }
    //Detetmine le nom d'utilisateur depuis son idetifiant
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
    //Detetmine la photo de couverture d'utilisateur depuis son idetifiant
    function userCover(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].cover)
            }
        }
    }
    //Detetmine la description d'utilisateur depuis son idetifiant
    function userDesc(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id===thisId){
                return(users[i].desc)
            }
        }
    }
    
    //Amener tous les utilisateurs
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
          
          const fetchRooms = async () => {
            const res = await axios.get("http://localhost:5000/api/room/a/"+props.userId);
            setRooms(res.data);
          }
          fetchRooms();
    }, [user._id, props.userId]);
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
    const roomCards = rooms!==undefined && rooms.map(x=>{
        return(
            <RoomCard 
              key={x._id}
              id={x._id}
              cover={x.cover}
              title={x.title}
              userId={x.userId}
              followers={x.followers}
            />
        )
    })
    
    //Amener les postes depuis le "backend"
    useEffect(() => {
        const fetchPosts = async () => {
        const res = await axios.get("http://localhost:5000/api/posts/profile1/" + props.userId); 
        setPosts(
            res.data.sort((p1, p2) => {
              return new Date(p2.date) - new Date(p1.date);
            })
        );
        };
        fetchPosts();
    }, [props.userId]);
    //Envoyer les publications chacune a sa composante avec ses "props"
    const otherPosts = posts.map(x=>{
        return(
           <Post 
                key={x._id}
                id={x._id}
                post={x}
                desc={x.desc}
                img={x.photo}
                date={x.date}
                userId={x.userId}
                room={x.room}
                like={x.likes}
                disLike={x.dislikes}
                roomers={x.roomers}
                vote={x.likeCount}
                comments={x.comments}
                sharer={x.sharer}
                shareDesc={x.shareDesc}
                shareDate={x.shareDate}
                originalId={x.originalId}
                />
    )})
    const handleFollow =  async () => {
        const followingList = user.following;
        const followersList = getUser(props.userId).followers;
        if(!followingList.includes(props.userId)){
            followingList.push(props.userId)
        } else {
            var index = followingList.indexOf(props.userId)
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
        await axios.put(`http://localhost:5000/api/user/${props.userId}`, {...getUser(props.userId), followers: followersList})
    } 
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
                <div className="chat-message">
                  <div className="notif-bell"><AiFillMessage /></div>
                  <Message handleChat={handleChat}/>

                </div>
            }
            {isChatClicked &&
              <AnimatePresence>
              <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="chatboxes">
                  {test.length <= 3 ? test : test.slice(0, 3)}
                  {/* {test[chatId]} */}
                </div>
              </motion.dev>
              </AnimatePresence>
            }
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <div className="profile">
            <div className="profile-card">
                <div className="profile-images">
                    {userCover(props.userId)==="https://i.ibb.co/MVjMppt/cover.jpg" 
                        ? <img className="profile-cover" src={userCover(props.userId)} alt="Cover"/>
                        : <img className="profile-cover" src={"http://localhost:5000/images/" + userCover(props.userId)} alt="Cover"/>
                    }
                    {userImg(props.userId)==="https://i.ibb.co/J25RQCT/profile.png" 
                        ? <img className="profile-pic" src={userImg(props.userId)} alt="Profile"/>
                        : <img className="profile-pic" src={"http://localhost:5000/images/" + userImg(props.userId)} alt="Profile"/>
                    }
                </div>
                <div className="profile-name">
                    <h1>{userName(props.userId)}</h1>
                    <div className="profile-add">
                        {!user.following.includes(props.userId)
                            ? <AiOutlinePlusCircle size={30} onClick={handleFollow}/>
                            : <AiFillPlusCircle size={30} onClick={handleFollow}/>
                        }
                        <b onClick={handleFollow}>{user.following.includes(props.userId)?"Unfollow":"Follow"}</b>
                    </div>
                </div>
                <div className="profile-desc">
                    <p>{userDesc(props.userId)}</p>
                </div>
            </div>
            <div className="profile-rooms">
                <h1 className="rooms-title">Rooms</h1>
                <div className="profile-room-grid">
                    {roomCards.length!==0
                        ? roomCards
                        : <h1 className="how-empty">How Empty</h1>
                    }
                </div>
            </div>
            {otherPosts}
        </div>
        </motion.dev>
         </AnimatePresence>
        </>
    )
} 