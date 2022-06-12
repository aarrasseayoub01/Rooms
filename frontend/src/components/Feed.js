import React, { useContext, useState, useEffect } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "./Navbar";
import Post from "./Post";
// import { postCall } from "../apiCalls";
import axios from "axios"
import { AuthContext } from "../Context/authContext";
import AddPost from "./AddPost";
import { MdAdd, MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import { AiFillMessage } from "react-icons/ai";
import Message from "./Message";
import Chatbox from "./Chatbox";
import RoomPost from "./RoomPost"
import { Link } from "react-router-dom";

export default function Feed() {
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgClicked] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [isRoomClicked, setIsRoomClicked] = useState(false);
  const [chatId, setChatId] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const [commentNotes, setCommentNotes] = useState([]);
  const [roomPosts, setRoomPosts] = useState([])
  // const [a, setA]=useState(true)
  const [rooms, setRooms] = useState([])

  const { user } = useContext(AuthContext);
  // function handleA() {
  //   setA(prev=>!prev)
  // }
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
  //Faire apparaitre les Rooms
  function openRoom(){
    setIsRoomClicked(prev=>!prev)
  }

  const addRoom = async () => {
    const res = await axios.get("http://localhost:5000/api/room/a/"+user._id)
      setRooms(res.data)
  }
  //Amener tous les publications du "backend"
  useEffect(() => {
    
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return (new Date(p2.shareDate ? p2.shareDate : p2.date) - new Date(p1.shareDate ? p1.shareDate : p1.date));
        })
      );
    };
    fetchPosts();
    const fetchRooms = async () => {
      const res = await axios.get("http://localhost:5000/api/room/a/"+user._id)
      setRooms(res.data)
      for(let i =0; i<res.data.length; i++){
         
        let a = await axios.get("http://localhost:5000/api/roompost/posts/"+res.data[i]._id)
        let b=a.data.map(post=>{
          return {...post, followers:res.data[i].followers, usersId:res.data[i].userId}
        })
        console.log(b)
        res.data[i]=b
      }
      setRoomPosts(res.data.flat())
      
    }
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
    )
  })
  
  //Envoyer les publications chacune a sa composante avec ses "props"
  const myPosts1 = roomPosts.map(x=>{
    const a = x;
    Array.isArray(x)?x=x[0]:x=a
    return(
      <RoomPost 
            key={x._id}
            id={x._id}
            desc={x.desc}
            img={x.photo}
            date={x.date}
            userId={x.userId}
            roomId={x.room}
            like={x.likes}
            disLike={x.dislikes}
            roomers={x.roomers}
            vote={x.likeCount}
            comments={x.comments}
            post={x}
             followers={x.followers}
            admins={x.usersId}
            
      />
)})
  const myPosts2 = posts.map(x=>{
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
              originalId={x.originalId}

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
                // handleA={handleA}
                
            />
        )
      }))
    }})
  const myPosts=myPosts1.concat(myPosts2)
  const test = chatId.map(x=><Chatbox key={x} username={x} ShutChat={ShutChat} />)
  const roomList = rooms.map(room=> {
    if(room!==[]){
      return(
        <div className="my-rooms" key={room._id}>
          <Link className="my-rooms" to={"../room/"+room._id}>
            <div className="mini-room">
              {room.cover === "https://i.ibb.co/MVjMppt/cover.jpg"
                ? <img className="profileimage" src={room.cover} alt="" />
                : <img className="profileimage" src={"http://localhost:5000/images/" + room.cover} alt="" />
              }
              <h5 className="roomname-overflow">{room.title}</h5>
            </div>
          </Link>
        </div>
      )
    } else {
      return null
    }
  }
    )
  return(
        <div className="flex-box">
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
                </div>
              
            }
            <AnimatePresence>
            <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="feed-page">
                <div className="feed-sidebar">
                  <div onClick={openRoom} className="rooms-banner">
                    <h3>Rooms</h3>
                  </div>
                  {isRoomClicked &&
                    <div className="room-hide">
                      <Link className="add-rooms-link" to="../newroom">
                        <div className="add-rooms" onClick={addRoom}>
                          <div className="add-rooms-button">
                            <MdAdd />
                            <h5>Add a Room</h5>
                          </div>
                        </div>
                      </Link>
                      {roomList}
                    </div>
                  }
                  <div>
                    <Link to={"../savedposts"} className="text-decoration">
                      <div className="saved-banner">
                        <h3>Saved</h3>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="feed">
                  <AddPost /> 
                  {myPosts.length!==0 && myPosts }
                </div>
                <div className="feed-fit"></div>
            </div>
            </motion.dev>
            </AnimatePresence>
        </div>
    )
}