import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike, AiOutlineClose, AiFillDelete, AiFillEdit, AiOutlineCheck, AiFillSave, AiOutlineSave} from "react-icons/ai"
import {motion, AnimatePresence} from 'framer-motion'
import { BiComment } from "react-icons/bi"
import { FiShare } from "react-icons/fi"
import Comment from "./Comment";
import { AuthContext } from "../Context/authContext";
import AddComment from "./AddComment";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import styled from "styled-components";



export default function Post(props) {
    const [users, setUsers] = useState([]);
    const [vote, setVote] = useState(props.like.length-props.disLike.length);
    const [roomers, setRoomers] = useState(props.like.length+props.disLike.length);
    const [comment, setComment] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [descValue,setDescValue] = useState(props.desc);
    const [sharerDescValue,setSharerDescValue] = useState(props.shareDesc);
    const [description,setDescription] = useState(props.desc);
    const [sharerDescription,setSharerDescription] = useState(props.shareDesc);
    const [likeState, setLikeState] = useState(props.post.likes)
    const [dislikeState, setDislikeState] = useState(props.post.dislikes)
    const [deleted, setDeleted] = useState(false);
    const [origDeleted, setOrigDeleted] = useState(false);

    const {user, dispatch} = useContext(AuthContext);
    var isSaved = false;
    for (let i=0;i<user.saved.length;i++){
        if(user.saved[i].id === props.id){
            isSaved = true;
            break;
        }
    }
    const [saved, setSaved] = useState(isSaved);
    const desc = useRef();
    const history = useNavigate()
    
    // let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false); //Modal pour le changement des donnees d'utilisateur

    

    function openModal() {
        setIsOpen(true); //Ouvrir le Modal
    }

    function closeModal() {
        setIsOpen(false); //Fermer le Modal
    }


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
        <Comment 
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
        const fetchPost = async () => {
            var res;
            props.originalId!==undefined && (res = await axios.get("http://localhost:5000/api/posts/isPostExist/"+props.originalId));
            res && setOrigDeleted(res.data);
        }
        fetchPost();
    }, [props.originalId]);
    
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
                await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, likes:likes, dislikes:dislikeState} );
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
                await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, likes:likes, dislikes:dislikeState} );
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
            await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, likes:likes,dislikes:dislikes} );
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
                await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, dislikes:dislikes, likes:likeState} );
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
                await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, dislikes:dislikes, likes:likeState} );
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
        await axios.put("http://localhost:5000/api/posts/" + props.id,{...props.post, likes:likes,dislikes:dislikes} );
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
        setEditClicked(true)
    }
    function handleEditTrue() {
        setIsEdit(true) //Activer le mode de modification de texte de la pubication
    }
    function handleEditFalse() {
        setIsEdit(false) //Desactiver le mode de modification de texte de la pubication
    }
    function handleChange(event) {
        if(user._id===props.userId){
        setDescValue(event.target.value) //Rendre la valeur de "input" incontrolle
        } 
        if(user._id===props.sharer){
        setSharerDescValue(event.target.value) //Rendre la valeur de "input" incontrolle
        }
    }
    const handleCheck = async () => {
        
        setIsEdit(false)
        //Definir une liste constitues des elements precedents sauf de changement de la valeur de texte du commentaire
        if(props.sharer==="" && user._id===props.userId){
            setDescription(descValue)
            await axios.put(
                `http://localhost:5000/api/posts/${props.id}`,
                {...props.post, desc: descValue}
            )
        } else{
            if(user._id===props.sharer){
                setSharerDescription(sharerDescValue)
                await axios.put(
                    `http://localhost:5000/api/posts/${props.id}`,
                    {...props.post, shareDesc: sharerDescValue}
                )
            }
        }
    }
    const handleSavePost = async () => {
        if (!saved){
            setSaved(true);
            dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: [...user.saved, {type: "post", id: props.id, saveDate: new Date()}]}});
            localStorage.setItem("user", JSON.stringify({...user, saved: [...user.saved, {type: "post", id: props.id, saveDate: new Date()}]}));
            await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: [...user.saved, {type: "post", id: props.id, saveDate: new Date()}]})
        } else{
            setSaved(false)
            const savedUpdated = user.saved.filter(x=>x.id !== props.id);
            dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: savedUpdated}});
            localStorage.setItem("user", JSON.stringify({...user, saved: savedUpdated}));
            await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: savedUpdated})
        }
    }
    const sharePost = async (e) => {
        const post = {desc:props.desc, userId:props.userId, date: props.date, photo: props.img,room:props.room, sharer:user._id, shareDate:new Date(), shareDesc:desc.current.value, originalId: props.id}
        try{
            await axios.post("http://localhost:5000/api/posts",post);
            //Envoyer le poste vers le "backend", et recharger la page pour que le poste s'affiche
        }catch(err){
                console.log(err) //En cas d'erreur    
        }
        setIsOpen(false)
        
    }
    const handleDeletePost = async () => {
        if(user._id===props.userId){
        await axios.delete(`http://localhost:5000/api/posts/${props.id}`, {data:{userId:user._id}})
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: user.saved.filter(x=>x.id===props.id)}});
        localStorage.setItem("user", JSON.stringify({...user, saved: user.saved.filter(x=>x.id===props.id)}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: user.saved.filter(x=>x.id===props.id)})
        } else{
            if(user._id===props.sharer){
                await axios.delete(`http://localhost:5000/api/posts/${props.id}`, {data:{userId:props.userId}})
                dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: user.saved.filter(x=>x.id===props.id)}});
        localStorage.setItem("user", JSON.stringify({...user, saved: user.saved.filter(x=>x.id===props.id)}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: user.saved.filter(x=>x.id===props.id)})
            }
        }
        const savedUpdated = user.saved.filter(x=>x.id !== props.id);
        dispatch({ type: "LOGIN_SUCCESS", payload: {...user, saved: savedUpdated}});
        localStorage.setItem("user", JSON.stringify({...user, saved: savedUpdated}));
        await axios.put(`http://localhost:5000/api/user/${user._id}`, {...user, saved: savedUpdated})
        //Envoyer dans le "backend" une publication dans laquelles les commentaires sont modifees
        setDeleted(!deleted);
    }
    function cancelDelete(){
        setPopup(false)
    }
    const [popup, setPopup] = useState(false);
    function checkDelete(){
        setPopup(true)
    }
    const postStyle = (props.sharer!==undefined && props.sharer.length!==0) ? {margin: "10px", padding : "20px", border: "1px solid black", borderRadius: "10px"} : {}
    if(!deleted){
    return(
          <div className="post">
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
                        <div className="modal-close" >
                            <AiOutlineClose onClick={closeModal} className="modal-close-btn2" />
                        </div>
                        <div className="modal-edit-desc">
                            {user.picture==="https://i.ibb.co/J25RQCT/profile.png" 
                                ? <img className="profileimage" src={user.picture} alt="" />
                                : <img className="profileimage" src={"http://localhost:5000/images/" + user.picture} alt="" />
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
                                {userImg(props.userId)==="https://i.ibb.co/J25RQCT/profile.png" 
                                    ? <img className="profileimage" src={userImg(props.userId)} alt="Post User Profile"/>
                                    : <img className="profileimage" src={"http://localhost:5000/images/" + userImg(props.userId)} alt="Post User Profile"/>
                                }
                                <div className="post-room-name" style={{gap: "20px"}} >
                                    <b>{userName(props.userId)}</b>
                                    <p><small>{dateTime(props.date)}</small></p>
                                </div>
                            </div>
                            <div className="modal-desc">
                                <p className="description-content">{description}</p>
                            </div>
                            <div className="shared-img-wrapper">
                                {props.img && <img src={"http://localhost:5000/images/" + props.img} className="shared-img" alt="Post" />}
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
                        <div className="div-submit">
                            <input className="add-submit" value="Share" type="submit" onClick={sharePost} style={{padding: "10px", cursor:"pointer"}}/>
                        </div>
                    </div>
                </ModalContent>
              </motion.dev>
              </AnimatePresence>
                </StyledModal>
              </Modal>

            <div>
              {popup &&
                <div className="deletecheck">
                    <h3>This post will be deleted !</h3>
                    <div className="delete-choice">
                        <button className="delete-btn" onClick={handleDeletePost}>Confirm</button>
                        <button className="delete-btn" onClick={cancelDelete}>Cancel</button>
                    </div>
                </div>
              }
              {props.sharer!==undefined && props.sharer.length!==0 &&
                (
                  <>
                    <div className="post-grid">
                        <Link className="comment-username" to={"../"+props.sharer}>
                            {userImg(props.sharer)==="https://i.ibb.co/J25RQCT/profile.png" 
                                ? <img className="profileimage" src={userImg(props.sharer)} alt="User Profile"/>
                                : <img className="profileimage" src={"http://localhost:5000/images/" + userImg(props.sharer)} alt="User Profile"/>
                            }
                        </Link>
                        <div className="post-room-name">
                            <Link className="post-username" to={"../"+props.sharer}> <b>{userName(props.sharer)}</b></Link>
                            {/* <h5><b>{props.room} -</b> <small>{userName(props.userId)}</small></h5> */}
                            <p><small>{dateTime(props.shareDate)}</small></p>
                        </div>
                        {(user._id === props.userId || user._id===props.sharer) && 
                            <div className="post-edit">
                                {!editClicked 
                                    ? <button onClick={handleDropwdown} className="dots-button"><BsThreeDots /></button>
                                    : <div className="post-edit-buttons">
                                        <AiOutlineClose onClick={handleCloseDropdown} style={{cursor: "pointer"}} />
                                        {user._id === props.sharer && 
                                        <>
                                            <AiFillEdit style={{cursor: "pointer"}} onClick={handleEditTrue}/>
                                            <AiFillDelete style={{cursor: "pointer"}} onClick={checkDelete}/>
                                        </>
                                    }
                                        {saved 
                                            ? <AiFillSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                            : <AiOutlineSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </div>
                  
                    <div className="post-desc">
                        {isEdit && (
                            <div className="edit-desc">
                                <textarea
                                    className="edit-description" 
                                    value={sharerDescValue} 
                                    onChange={(event)=>handleChange(event)}
                                />
                                <AiOutlineClose onClick={handleEditFalse} className="post-like"/>
                                <AiOutlineCheck onClick={handleCheck} className="post-like"/>
                            </div>
                        )}
                        {!isEdit && <p className="description-content">{sharerDescription}</p>}
                    </div>
                  </>
                )
              }
            </div>
            <div>
                <div style={postStyle}>
                <div className="orig-post">
                    {!props.singlepost 
                        ? (!origDeleted && <Link className="post-username" to={"../posts/"+props.id}><small className="orig-post-btn">Visit the Original Post</small></Link>)
                        : <small onClick={() => history(-1)} className="orig-post-btn">Return</small>
                    }
                </div>
                <div className="post-grid">
                    <Link className="comment-username" to={"../"+props.userId}>
                        {userImg(props.userId)==="https://i.ibb.co/J25RQCT/profile.png" 
                            ? <img className="profileimage" src={userImg(props.userId)} alt="" />
                            : <img className="profileimage" src={"http://localhost:5000/images/" + userImg(props.userId)} alt="" />
                        }
                    </Link>
                    <div className="post-room-name">
                        <Link className="post-username" to={"../"+props.userId}> <b>{userName(props.userId)}</b></Link>
                        {/* <h5><b>{props.room} -</b> <small>{userName(props.userId)}</small></h5> */}
                        <p><small>{dateTime(props.date)}</small></p>
                    </div>
                        {props.sharer!==undefined && props.sharer.length===0 && 
                            (<div className="post-edit">
                                {!editClicked 
                                    ? <button onClick={handleDropwdown} className="dots-button"><BsThreeDots /></button>
                                    : <div className="post-edit-buttons">
                                        <AiOutlineClose onClick={handleCloseDropdown} style={{cursor: "pointer"}} />
                                    {user._id === props.userId && 
                                        <>
                                            <AiFillEdit style={{cursor: "pointer"}} onClick={handleEditTrue}/>
                                            <AiFillDelete style={{cursor: "pointer"}} onClick={checkDelete}/>
                                        </>
                                    }
                                        {saved 
                                            ? <AiFillSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                            : <AiOutlineSave style={{cursor: "pointer"}} onClick={handleSavePost} />
                                        }
                                    </div>
                                }
                            </div>)
                        }
                </div>
                {props.sharer!==undefined && props.sharer.length===0 
                  ?(
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
                  )
                  :(!origDeleted
                        ? <p className="description-content">{props.desc}</p>
                        : <p>Cette publication est supprim?? par son autheur.</p>
                  )}
                <div>
                    {!(props.sharer!==undefined && props.sharer.length!==0 && origDeleted) &&
                        props.img && <img src={"http://localhost:5000/images/" + props.img} width="100%" alt="Post" />
                    }
                </div>
            </div>
                <div className="post-interact">
                    {props.sharer!==""
                        ? (
                            <div className="post-rating">
                                {vote >=0 
                                    ? <AiFillLike className="post-like"/>
                                    : <AiFillDislike className="post-like" />
                                }
                                <small>{props.like.length+props.disLike.length} Roomers</small>
                                <small style={{width: "120%"}}>{props.comments.length} comments</small>
                            </div>
                        )
                        : (
                            <div className="post-rating">
                                {vote >=0 
                                    ? <AiFillLike className="post-like"/>
                                    : <AiFillDislike className="post-like" />
                                }
                                <small>{roomers} Roomers</small>
                                <small>{props.comments.length} comments</small>
                            </div>
                        )
                    }
                    {props.sharer!==undefined && props.sharer.length===0 &&(
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
                        <div className="hover-cursor">
                            <div onClick={openModal} className="hover-background">
                                <FiShare />
                                <small className="hidable" style={{marginLeft:"5px"}}>share</small>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                </div>
                {props.sharer!==undefined && props.sharer.length!==0 &&(
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
                        <div className="hover-cursor">
                            <div onClick={openModal} className="hover-background">
                                <FiShare />
                                <small className="hidable" style={{marginLeft:"5px"}}>share</small>
                            </div>
                        </div>
                    </div>
                )}
                {comment && 
                <div className="comment">
                    {/* <div className="comment-close"><AiOutlineClose className="hover-background" onClick={()=>handlecomment()} /></div> */}
                    <AddComment post={props.post} comments={props.comments} handleA={props.handleA}/>
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
const StyledModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 10%;
  @media only screen and (max-width: 660px) {
    right: 42.5%;
  }
  background: none;
`;
const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: #eeeeee;
  width: 50%;
  min-height: 50vh;
  padding: 30px;
  box-shadow: 0px 3px 6px #00000029;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  @media only screen and (max-width: 660px) {
    width: 90%;
  }
`;