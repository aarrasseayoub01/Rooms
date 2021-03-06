import React, { useContext, useEffect, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike, AiOutlineClose, AiFillDelete, AiFillEdit, AiOutlineCheck, AiFillSave, AiOutlineSave} from "react-icons/ai"
import { BiComment } from "react-icons/bi"
import RoomComment from "./RoomComment";
import { AuthContext } from "../Context/authContext";
import AddRoomComment from "./AddRoomComment";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";



export default function RoomPost(props) {
    const [users, setUsers] = useState([]);
    const [vote, setVote] = useState(props.like.length-props.disLike.length);
    const [roomers, setRoomers] = useState(props.like.length+props.disLike.length);
    const [comment, setComment] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [descValue,setDescValue] = useState(props.desc);
    const [description,setDescription] = useState(props.desc);
    const [likeState, setLikeState] = useState(props.post.likes);
    const [dislikeState, setDislikeState] = useState(props.post.dislikes);
    const [deleted, setDeleted] = useState(false);
    const {user, dispatch} = useContext(AuthContext);
    var isSaved = false;
    for (let i=0;i<user.saved.length;i++){
        if(user.saved[i].id === props.id){
            isSaved = true;
            break;
        }
    }
    const [saved, setSaved] = useState(isSaved);

    // const desc = useRef();
    const history = useNavigate()
    
    // let subtitle;
    // const [modalIsOpen, setIsOpen] = useState(false); //Modal pour le changement des donnees d'utilisateur

    

    // function closeModal() {
    //     setIsOpen(false); //Fermer le Modal
    // }


    //33-64 : Determiner le temps qui a passe depuis le moment du publication de poste et le temps actuel
   
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
    //Envoyer les commentaires chacune a sa composante avec ses "props"
    const comments = props.comments.map(x=>
        <RoomComment 
            key={x.id}
            id={props.id}
            userId={x.userId}
            content={x.content}
            vote={x.vote}
            date={x.date}
            likes={x.likes}
            dislikes={x.dislikes}
            comments={props.comments}
            comment={x}
            post={props.post}
        />
    )
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
    }, []);

    const isLiked = likeState.flat().includes(user.username) //Etat de boutton de "like"
    const isDisliked = dislikeState.flat().includes(user.username) //Etat de boutton de "dislike"
    //Clique sur le button de "like" declenche ce code ci-dessous
    const upvote = async () => {
        if(!isDisliked){
            if(!isLiked) {
                setVote(prevVote=>prevVote+1);
                setRoomers(prevRoomer=>prevRoomer+1);
                let likes=likeState;
                setLikeState(prev=>{
                    prev.push([user.username,props.id, new Date()])
                    return prev
                })
                likes.push([user.username,props.id, new Date()])
                await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, likes:likes, dislikes:dislikeState} );
                //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees

            }else{
                setVote(prevVote=>prevVote-1);
                setRoomers(prevRoomer=>prevRoomer-1);
                let likes=likeState;
                setLikeState(prev=>{
                    const list = prev.filter((item)=> {
                        return item[0] !== user.username
                    })
                    return list
                })
                likes=likes.filter((item) =>{
                    return item[0] !== user.username
                })
                await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, likes:likes, dislikes:dislikeState} );
                //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees

            }
        }else{
            setVote(prevVote=>prevVote+2)
            const likes=likeState
                setLikeState(prev=>{
                    prev.push([user.username,props.id, new Date()])
                    return prev
                })
                likes.push([user.username,props.id, new Date()])
            let dislikes=dislikeState;
                setDislikeState(prev=>{
                    const list = prev.filter(function(item) {
                        return item[0] !== user.username
                    })
                    return list
                })
                dislikes= dislikes.filter(function(item) {
                    return item[0] !== user.username
                })
            await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, likes:likes,dislikes:dislikes} );
            //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees
          
        }
    }
    
    const downvote = async () => {
        if(!isLiked){
            if(!isDisliked) {
                setVote(prevVote=>prevVote-1);
                setRoomers(prevRoomer=>prevRoomer+1);
                const dislikes=dislikeState
                setDislikeState(prev=>{
                    prev.push([user.username,props.id, new Date()])
                    return prev
                })
                dislikes.push([user.username,props.id, new Date()])
                await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, dislikes:dislikes, likes:likeState} );
                //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees

            }else{
                setVote(prevVote=>prevVote+1);
                setRoomers(prevRoomer=>prevRoomer-1);
                let dislikes=dislikeState;
                setDislikeState(prev=>{
                    const list = prev.filter(function(item) {
                        return item[0] !== user.username
                    })
                    return list
                })
                dislikes=dislikes.filter(function(item) {
                    return item[0] !== user.username
                })
                await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, dislikes:dislikes, likes:likeState} );
                //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees
            }
        }else{
            setVote(prevVote=>prevVote-2)
            let dislikes=dislikeState
            setDislikeState(prev=>{
                prev.push([user.username,props.id, new Date()])
                return prev
            })
            dislikes.push([user.username,props.id, new Date()])
        let likes=likeState;
            setLikeState(prev=>{
                const list = prev.filter(function(item) {
                    return item[0] !== user.username
                })
                return list
            })
            likes=likes.filter(function(item) {
                return item[0] !== user.username
            })
        await axios.put("http://localhost:5000/api/roompost/" + props.id,{...props.post, likes:likes,dislikes:dislikes} );
        //Envoyer dans le "backend" une publication dans laquelles l'etat de "like" sont modifees
        }
    }
    function handlecomment() {
        // setComment(prevComment=>!prevComment)
        setComment(true)
    }
    function handleCloseDropdown(){
        setEditClicked(false)
    }

    function handleDropwdown() {
        setEditClicked(true);
    }
    function handleEditTrue() {
        setIsEdit(true) //Activer le mode de modification de texte de la pubication
    }
    function handleEditFalse() {
        setIsEdit(false) //Desactiver le mode de modification de texte de la pubication
    }
    function handleChange(event) {
        if(props.userId.includes(user._id)){
            setDescValue(event.target.value) //Rendre la valeur de "input" incontrolle
        } 
        
    }
    const handleCheck = async () => {
        
        setIsEdit(false)
        //Definir une liste constitues des elements precedents sauf de changement de la valeur de texte du commentaire
        if(props.userId.includes(user._id)){
            setDescription(descValue)
            await axios.put(
                `http://localhost:5000/api/roompost/${props.id}`,
                {...props.post, desc: descValue}
            )
        } 
    }

    
    const handleDeletePost = async () => {
        if(props.userId.includes(user._id)){
            await axios.delete(`http://localhost:5000/api/roompost/${props.id}`, {data:{userId:user._id}})
            dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: user.saved.filter(x=>x.id===props.id)}});
        localStorage.setItem("user", JSON.stringify({...user, saved: user.saved.filter(x=>x.id===props.id)}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: user.saved.filter(x=>x.id===props.id)})
        } 
        //Envoyer dans le "backend" une publication dans laquelles les commentaires sont modifees
        setDeleted(!deleted);
    }
    const handleSavePost = async () => {
        if (!saved){
            setSaved(true);
            dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: [...user.saved, {type: "roompost", id: props.id, saveDate: new Date()}]}});
            localStorage.setItem("user", JSON.stringify({...user, saved: [...user.saved, {type: "roompost", id: props.id, saveDate: new Date()}]}));
            await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: [...user.saved, {type: "roompost", id: props.id, saveDate: new Date()}]})
        } else{
            setSaved(false)
            const savedUpdated = user.saved.filter(x=>x.id !== props.id);
            dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: savedUpdated}});
            localStorage.setItem("user", JSON.stringify({...user, saved: savedUpdated}));
            await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: savedUpdated})
        }
    }
    const postStyle = {}
    if(!deleted){
    return(
          <div className="post">
{/*                               

               <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    ariaHideApp={false}
                >
                <StyledModal onClick={() => setIsOpen(false)}>

              <AnimatePresence>
               <motion.dev initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <ModalContent
                    className="modalContent"
                    style={{margin: "2.5% 25%"}}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="profile-modal">
                        <div className="modal-edit-desc">
                            {user.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                                ? <img className="profileimage" src={user.picture} />
                                : <img className="profileimage" src={"http://localhost:5000/images/" + user.picture} />
                            }
                            <textarea
                                className="modal-description" 
                                placeholder="Add a description" 
                                onChange={(event)=>handleChange(event)}
                                ref={desc}
                            />
                        </div>
                        <div className="modal-wrapper">
                            <div className="modal-grid">
                                {userImg(props.userId[0])==="https://i.ibb.co/J25RQCT/profile.png" 
                                    ? <img className="profileimage" src={userImg(props.userId[0])} alt="Post User Profile"/>
                                    : <img className="profileimage" src={"http://localhost:5000/images/" + userImg(props.userId[0])} alt="Post User Profile"/>
                                }
                                <div className="post-room-name" style={{gap: "20px"}} >
                                    <b>{userName(props.userId[0])}</b>
                                    <p><small>{dateTime(props.date)}</small></p>
                                </div>
                            </div>
                            <div className="modal-desc">
                                <p className="description-content">{description}</p>
                            </div>
                            <div>
                                {props.img && <img src={"http://localhost:5000/images/" + props.img} width="100%" alt="Post image" />}
                            </div>
                            <div className="post-interact">
                                <div className="modal-rating">
                                    {vote >=0 
                                        ? <AiFillLike className="post-like"/>
                                        : <AiFillDislike className="post-like" />
                                    }
                                    <small>{roomers} Roomers</small>
                                    <small>Vote : {vote}</small>
                                    <small style={{width: "120%"}}>{props.comments.length} comments</small>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </ModalContent>
              </motion.dev>
              </AnimatePresence>
                </StyledModal>
              </Modal> */}

            
            <div>
                <div style={postStyle}>
                <div className="orig-post">
                    {!props.singlepost 
                        ? <Link className="post-username" to={"../roompost/"+props.id+'/'+props.roomId}><small className="orig-post-btn">Visit the Original Post</small></Link>
                        : <small onClick={() => history(-1)} className="orig-post-btn">Return</small>
                    }
                </div>
                <div className="post-grid">
                    <Link className="comment-username" to={"../"+props.userId[0]}> 
                        {userImg(props.userId[0])==="https://i.ibb.co/J25RQCT/profile.png" 
                            ? <img className="profileimage" src={userImg(props.userId[0])} alt="user" />
                            : <img className="profileimage" src={"http://localhost:5000/images/" + userImg(props.userId[0])} alt="user" />
                        }
                    </Link>
                    <div className="post-room-name">
                        <Link className="post-username" to={"../"+props.userId[0]}><b>{userName(props.userId[0])}</b></Link>
                        <p><small>{dateTime(props.date)}</small></p>
                    </div>
                        <div className="post-edit">
                                    {!editClicked 
                                        ? <button onClick={handleDropwdown} className="dots-button"><BsThreeDots /></button>
                                        : <div className="post-edit-buttons">
                                            <AiOutlineClose onClick={handleCloseDropdown} style={{cursor: "pointer"}} />
                                        {props.userId.includes(user._id) && 
                                            <>
                                                <AiFillEdit style={{cursor: "pointer"}} onClick={handleEditTrue}/>
                                                <AiFillDelete style={{cursor: "pointer"}} onClick={handleDeletePost}/>
                                            </>
                                        }
                                            {saved 
                                                ? <AiFillSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                                : <AiOutlineSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                            }
                                        </div>
                                    }
                        </div>
                </div>
                
                    <div className="post-desc">
                        {isEdit && (
                            <div className="edit-desc">
                                <textarea
                                    className="edit-description" 
                                    value={descValue} 
                                    onChange={(event)=>handleChange(event)}
                                />
                                <AiOutlineClose onClick={handleEditFalse} className="post-like"/>
                                <AiOutlineCheck onClick={handleCheck} className="post-like"/>
                            </div>
                        )}
                        {!isEdit && <p className="description-content">{description}</p>}
                    </div>
                
                
                <div>
                    {props.img && <img src={"http://localhost:5000/images/" + props.img} width="100%" alt="Post" />}
                </div>
            </div>
            
                <div className="post-interact">
                    <div className="post-rating">
                        {vote >=0 
                            ? <AiFillLike className="post-like"/>
                            : <AiFillDislike className="post-like" />
                        }
                        <small>{roomers} Roomers</small>
                        <small style={{width: "120%"}}>{props.comments.length} comments</small>
                    </div>
                    {(props.admins.includes(user._id) || props.followers.includes(user._id)) &&
                        <div className="post-rate">
                            <div>
                                {isLiked
                                    ? <AiFillLike onClick={()=>upvote()} className="post-like"/>
                                    : <AiOutlineLike onClick={()=>upvote()} className="post-like"/>
                                }
                                <small>{vote}</small>
                                {isDisliked
                                    ? <AiFillDislike onClick={()=>downvote()} className="post-like"/>
                                    : <AiOutlineDislike onClick={()=>downvote()} className="post-like"/>
                                }
                            </div>
                            <div onClick={handlecomment}>
                                <div style={{cursor: "pointer"}} className="hover-background">
                                    <BiComment />
                                    <small className="hidable" style={{marginLeft:"5px"}}> comments</small>
                                </div>
                            </div>
                        </div>
                    }
                    
                </div>
                </div>
                
                {comment && 
                <div className="comment">
                    <AddRoomComment post={props.post} comments={props.comments} handleA={props.handleA}/>
                    {props.comments.length!==0 && 
                        <div className="comment-section">
                            {comments}
                        </div>
                    }
                </div>
                }
        </div>
    )
        } else{
            return null
        }
}   
// const StyledModal = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   position: fixed;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
// `;
// const ModalContent = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;

//   background-color: #eeeeee;
//   width: 50%;
//   min-height: 50vh;
//   padding: 30px;
//   box-shadow: 0px 3px 6px #00000029;
//   overflow-y: auto;
//   max-height: calc(100vh - 100px);
// `;