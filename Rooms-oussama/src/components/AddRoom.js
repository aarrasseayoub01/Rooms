import React, { useContext, useState, useEffect, useRef } from "react";
import {motion, AnimatePresence} from 'framer-motion'
import Navbar from "./Navbar";
import Post from "./Post";
// import { postCall } from "../apiCalls";
import axios from "axios"
import { AuthContext } from "../Context/authContext";
import { MdNotificationsActive } from "react-icons/md";
import Notification from "./Notification";
import Message from "./Message";
import { AiFillMessage, AiOutlineClose } from "react-icons/ai";
import Chatbox from "./Chatbox";
import { BsCardImage } from "react-icons/bs";
import MiniSearchedAdmin from "./MiniSearchedAdmin";

export default function AddRoom() {
  const [isNotifClicked, setIsNotifClicked] = useState(false);
  const [isMsgClicked, setIsMsgClicked] = useState(false);
  const [isChatClicked, setIsChatClicked] = useState(false);
  const [coverPic, setCoverPic] = useState("post1.jpg");
  const [chatId, setChatId] = useState([]);
  const [posts, setPosts] = useState({});
  const [likeNotes, setLikeNotes] = useState([]);
  const [dislikeNotes, setDislikeNotes] = useState([]);
  const [commentNotes, setCommentNotes] = useState([]);
  const [file,setFile]=useState()
  const [admin, setAdmin] = useState([]);
  const title = useRef()
  const desc = useRef()
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

  //radio
  const [radioCheck, setRadioCheck] = useState("page");

  function handleChange(event) {
    // const {value, type, checked} = event.target
    setRadioCheck(prev=>(prev==="page" ? "group" : "page"))
  }
  const handleSubmit = async () => {
  const room = await axios.post("http://localhost:5000/api/room/",{userId:[user._id, ...admin], cover:coverPic, title: title.current.value, desc:desc.current.value, type:radioCheck})

  }
  //Ajouter un autre admin
  const [addAdmin,setAddAdmin] = useState([<input className="login-input" value={user.username} />]);
  const [admins, setAdmins] = useState([user._id]);
  const [input, setInput] = useState("");

  function handleInputChange(e){
    setInput(e)
  }

  //Amener tous les publications du "backend"
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/posts/" + user._id);
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
  function handleDelete(username, id){
    setAdmins(admins.filter(x=>x!==id));
    setAddAdmin(addAdmin.filter(x=>x.props.value!==username))
  }
  const handleSetName = async (username) => {
    if(username!==user.username && !admins.includes(username)) {
      let id = await axios.get("http://localhost:5000/api/user/allusers/");
      id=id.data.filter(x=>x.username===username)
      setAdmin(prev=>{
        return [...prev, id[0]._id]
      })
      setAddAdmin(prev=>[...prev,(
        <div className="addedAdmin">
          <input className="login-input" id="addedAdmin" value={username} />
          <AiOutlineClose style={{cursor :"pointer"}} onClick={()=>handleDelete(username, id)} />
        </div>
      )])
      }
        setAdmins(prev=>{
      !prev.includes(username) && prev.push(username);
      return prev;
    })
    setInput("");
  }
  const searchedAdmin = users.map(x=>{
    return(input!=="" && x.username.toLowerCase().includes(input.toLowerCase()) //Rendre le recherche insensible au majuscules et miniscules
        ?(<AnimatePresence>
        <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <MiniSearchedAdmin handleSetName={handleSetName} style={{overflowY :"scroll"}} key={x._id} id={x._id} username={x.username} image={x.picture} />
            </motion.dev>
        </AnimatePresence>):null)
    }
  )
  const handleUpload = async (e) => {
    const pic=e.target.files[0]; //Initialiser "pic" avec l'image telecharger depuis la machine
    setFile(e.target.files[0])
    const data = new FormData(); //Initialiser "data" par une Forme de donnes
    const fileName = Date.now() + pic.name; //Initialiser "fileName" par le nom de fichier telecharge
    data.append("name", fileName);
    data.append("file", pic);
    //Ajouter les informations de fichier telecharge a notre "data"
    try {
        await axios.post("http://localhost:5000/api/upload", data);
        //envoyer la donnee vers le "backend" avec "axios" dans le champs "upload"
      } catch (err) {}
      setCoverPic(fileName)
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
            <div className="add-room">
                <div className="add-room-title">
                    <h1>Add a New Room</h1>
                </div>
                <div className="add-room-page">
                    <div className="modal-form">
                        <div className="flex-row" style={{justifyContent :"center"}}>
                            <h3 style={{width: "200px"}}>Cover :</h3>
                            {coverPic !== null && <img src={"http://localhost:5000/images/" +coverPic} width="100px" alt="Cover image"/>}
                            <label>
                                <BsCardImage className="upload-image"/>
                                <input type="file" style={{display: "none"}} name="myImage" onChange={(e) =>  handleUpload(e)}/>
                            </label>
                        </div>
                    </div>
                    <h1>Room Data</h1>
                    <form className="modal-form">
                        <div className="flex-row">
                            <h3 style={{width: "250px"}}>Room Name :</h3>
                            <input className="login-input" placeholder="Enter a Name for the Room" ref={title}/>
                        </div>
                        <div className="flex-row">
                            <h3 style={{width: "250px"}}>Admin :</h3>
                              <div className="room-admin-make">
                                {radioCheck === "group" 
                                  ? addAdmin
                                  : <input className="login-input" value={user.username} />
                                }
                                {radioCheck === "group" && <div className="room-admins">
                                  <div className="room-admins" style={{flexDirection: "column"}}>
                                    <input className="login-input" placeholder="User Name" onChange={(e)=>handleInputChange(e.target.value)} value={input} />
                                    {searchedAdmin}
                                  </div>
                                </div>}
                             </div>
                        </div>
                        <div className="flex-row" style={{gap: "100px"}}>
                            <h3 style={{width: "200px"}}>Type :</h3>
                            <div className="room-radio">
                                <div className="room-radio-row">
                                    <input 
                                        className="radio-width" 
                                        type="radio" 
                                        id="group" 
                                        value="group" 
                                        checked={radioCheck === "group"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="group">Group</label>
                                </div>
                                <div className="room-radio-row">
                                    <input 
                                        className="radio-width" 
                                        type="radio" 
                                        id="page" 
                                        value="page" 
                                        checked={radioCheck === "page"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="page">Page</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex-row" style={{gap: "50px"}}>
                            <h3 style={{width: "250px"}}>Description :</h3>
                            <input className="login-textarea" type="textarea" placeholder="Description" ref={desc}/>
                        </div>
                        <input style={{backgroundColor:"white", cursor: "pointer"}} type="submit" value="Add Room" className="add-submit" onClick={handleSubmit}/>
                    </form>
                </div>
            </div>
            </motion.dev>
            </AnimatePresence>
        </>
    )
}