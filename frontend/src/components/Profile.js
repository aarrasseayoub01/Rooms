import React, { useContext, useEffect, useRef, useState } from "react"
import {motion, AnimatePresence} from 'framer-motion'

import Navbar from "./Navbar"
import { AiFillEdit, AiFillMessage, AiOutlineClose } from "react-icons/ai"
import RoomCard from "./RoomCard"
import Post from "./Post"
import axios from "axios"
import { AuthContext } from "../Context/authContext"
import AddPost from "./AddPost"
import Modal from 'react-modal';
import { BsCardImage } from "react-icons/bs"
// import { CSSTransition } from 'react-transition-group';
import styled from "styled-components";
import { MdNotificationsActive } from "react-icons/md"
import Notification from "./Notification"
import Message from "./Message"
import Chatbox from "./Chatbox"

//Presque le meme que "Feed.js"

export default function Profile() {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const [isMsgClicked, setIsMsgClicked] = useState(false);
    const [isChatClicked, setIsChatClicked] = useState(false);
    const [chatId, setChatId] = useState([]);
    const [posts, setPosts] = useState([]);
    const { user, dispatch } = useContext(AuthContext);
    const [profPic, setProfPic] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [profPic1, setProfPic1] = useState("");
    const [coverPic1, setCoverPic1] = useState("");
    const [likeNotes, setLikeNotes] = useState([]);
    const [dislikeNotes, setDislikeNotes] = useState([]);
    const [commentNotes, setCommentNotes] = useState([]);
    const [rooms, setRooms] = useState();
    const userName = useRef();
    const email = useRef();
    const password = useRef();
    const desc = useRef();

    
    // let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false); //Modal pour le changement des donnees d'utilisateur

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
    function openModal() {
        setIsOpen(true); //Ouvrir le Modal
    }

    function closeModal() {
        setIsOpen(false); //Fermer le Modal
    }
       
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
    });
    
    const handleChange = async () => {
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, picture:(profPic1!==""?profPic1:user.picture),cover:(coverPic1!==""?coverPic1:user.cover),username:(userName.current.value!==""?userName.current.value:user.username), email:(email.current.value!==""?email.current.value:user.email), password:(password.current.value!==""?password.current.value:user.password), desc:(desc.current.value!==""?desc.current.value:user.desc)}});
        localStorage.setItem("user", JSON.stringify({...user, picture:(profPic1!==""?profPic1:user.picture),cover:(coverPic1!==""?coverPic1:user.cover),username:(userName.current.value!==""?userName.current.value:user.username), email:(email.current.value!==""?email.current.value:user.email), password:(password.current.value!==""?password.current.value:user.password), desc:(desc.current.value!==""?desc.current.value:user.desc)}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, picture:(profPic1!==""?profPic1:user.picture),cover:(coverPic1!==""?coverPic1:user.cover),username:(userName.current.value!==""?userName.current.value:user.username), email:(email.current.value!==""?email.current.value:user.email), password:(password.current.value!==""?password.current.value:user.password), desc:(desc.current.value!==""?desc.current.value:user.desc)})
        //Modifier les donnees d'utilisateur
    }
    //Manipuler le changement des photo de profil ou de couverture
    useEffect(() => {
        const changeProfPic = async () => {
        if (profPic) {
            const data = new FormData();
            const fileName = Date.now() + profPic.name;
            data.append("name", fileName);
            data.append("file", profPic);
            
            try {
              await axios.post("http://localhost:5000/api/upload", data);
            } catch (err) {
                console.log(err)
            }
            setProfPic1(fileName)
          }
        }
        changeProfPic();
        const changeCoverPic = async () => {
        if (coverPic) {
            const data = new FormData();
            const fileName = Date.now() + coverPic.name;
            data.append("name", fileName);
            data.append("file", coverPic);
            
            try {
              await axios.post("http://localhost:5000/api/upload", data);
            } catch (err) {
                console.log(err)
            }
            setCoverPic1(fileName)
          }
        }
        changeCoverPic();
        const fetchPosts = async () => {
        const res = await axios.get("http://localhost:5000/api/posts/profile1/" + user._id);
        setPosts(
            res.data.sort((p1, p2) => {
              // return new Date(p2.date) - new Date(p1.date);
              return (new Date(p2.shareDate ? p2.shareDate : p2.date) - new Date(p1.shareDate ? p1.shareDate : p1.date));
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
        const fetchRooms = async () => {
          const res = await axios.get("http://localhost:5000/api/room/a/"+user._id);
          setRooms(res.data);
        }
        fetchRooms();
    }, [user._id, profPic, coverPic]);
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
    const myPosts = posts.map(x=>{
        const a = x;
        Array.isArray(x)?x=x[0]:x=a

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
                roomers={x.roomers}
                vote={x.likeCount}
                comments={x.comments}
                post={x}
                sharer={x.sharer}
                shareDesc={x.shareDesc}
                shareDate={x.shareDate}
                originalId={x.originalId}
                />
    )})

  const test = chatId.map(x=><Chatbox key={x} username={x} ShutChat={ShutChat} />)
  return(
        <>
        {/* <Navbar handleNotif={handleNotif}/> */} 
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
            
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                ariaHideApp={false}

            >
              <StyledModal onClick={() => setIsOpen(false)}>

                <ModalContent
                  className="modalContent"
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="profile-modal">
                    <div className="modal-close">
                        <AiOutlineClose onClick={closeModal} className="modal-close-btn" />
                    </div>
                    <div className="modal-form"> 
                        <div className="flex-row">
                            <h3 className="fit-label">Profile :</h3>
                            {user.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                                ? <img className="profileimage" src={user.picture} alt="Profile"/>
                                : <img className="profileimage" src={"http://localhost:5000/images/" + (profPic1!==""?profPic1:user.picture)} alt="Profile"/>
                            }
                            <label>
                                <BsCardImage className="upload-image"/>
                                <input type="file" style={{display: "none"}} name="myImage" onChange={(e) => setProfPic(e.target.files[0])}/>
                            </label>
                        </div>
                        <div className="flex-row">
                            <h3 className="fit-label">Cover :</h3>
                            {/* <img src={"http://localhost:5000/images/" +(coverPic1!==""?coverPic1:user.cover)} alt="Cover Image" width="100px" /> */}
                            {user.cover==="https://i.ibb.co/MVjMppt/cover.jpg" 
                                ? <img src={user.cover} width="100px" alt="Cover"/>
                                : <img src={"http://localhost:5000/images/" + (coverPic1!==""?coverPic1:user.cover)} width="100px" alt="Cover"/>
                            }
                            <label>
                                <BsCardImage className="upload-image"/>
                                <input type="file" style={{display: "none"}} name="myImage" onChange={(e) => setCoverPic(e.target.files[0])}/>
                            </label>
                        </div>
                    </div>
                    <h2>Edit Profile</h2>
                    <form className="modal-form">
                        <div className="flex-row">
                            <h3 className="fit-label">Username :</h3>
                            <input className="login-input" placeholder={user.username} ref={userName} />
                        </div>
                        <div className="flex-row">
                            <h3 className="fit-label">Email :</h3>
                            <input className="login-input" placeholder={user.email} ref={email} />
                        </div>
                        <div className="flex-row">
                            <h3 className="fit-label">Password :</h3>
                            <input className="login-input" type="password" placeholder="Password" ref={password} />
                        </div>
                        <div className="flex-row">
                            <h3 className="fit-label">Description :</h3>
                            <textarea className="login-textarea" type="textarea" placeholder="Description" ref={desc}/>
                        </div>
                        <input type="submit" className="add-submit" onClick={handleChange}/>
                    </form>
                </div>
                </ModalContent>
                </StyledModal>
            </Modal>
            
            <div className="profile-card">
                <div className="profile-images">
                    {user.cover==="https://i.ibb.co/MVjMppt/cover.jpg" 
                        ? <img className="profile-cover" src={user.cover} alt="Cover"/>
                        : <img className="profile-cover" src={"http://localhost:5000/images/" + user.cover} alt="Cover"/>
                    }
                    {user.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                        ? <img className="profile-pic" src={user.picture} alt="Profile"/>
                        : <img className="profile-pic" src={"http://localhost:5000/images/" + user.picture} alt="Profile"/>
                    }
                </div>
                <div className="profile-name1">
                    <h1>{user.username}</h1>
                </div>
                <div className="profile-desc">
                    {user.desc 
                        ? <div className="edit-desc">
                            <p>{user.desc}</p>
                          </div>
                        : <div className="div-submit" style={{marginBottom: "10px"}}>
                            <button onClick={openModal} className="add-submit"><b>Add Description</b></button>
                          </div> 
                    }
                </div>
                <label>
                    <AiFillEdit onClick={openModal} className="profile-pic-edit"/>
                </label>
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
            <AddPost />
            {myPosts}
        </div>
        </motion.dev>
         </AnimatePresence>
         </>
    )
} 
const StyledModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: none;
`;
const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: #fff;
  width: 60%;
  min-height: 50vh;
  padding: 30px;
  box-shadow: 0px 3px 6px #00000029;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  @media only screen and (max-width: 660px) {
    width: 100%;
  }
`;