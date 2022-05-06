import React, { useContext, useEffect, useState } from "react"
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike, AiFillEdit, AiFillDelete, AiOutlineClose, AiOutlineCheck} from "react-icons/ai"
import axios from "axios"
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/authContext";
import { BsThreeDots } from "react-icons/bs";

export default function Comment(props) {
    const showStyle = {display: "flex"}
    const hideStyle = {display: "none"}
    const [style, setStyle] = useState(hideStyle);
    const [editClicked, setEditClicked] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [posts, setPosts] = useState([props.post.comments]);
    const [users, setUsers] = useState([]);
    const [commentVote, setCommentVote] = useState(props.likes.length-props.dislikes.length);
    const [likeState, setLikeState] = useState(props.likes);
    const [dislikeState, setDislikeState] = useState(props.dislikes);
    const [descValue,setDescValue] = useState(props.content);
    const [description,setDescription] = useState(props.content);
    const [deleted, setDeleted] = useState(false)
    const {user} = useContext(AuthContext);
    
    useEffect(() => {
        const fetchPosts = async () => {
          const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);
          console.log("db")
          console.log(res.data.comments)
          //   const post = res.data.comments.filter(comment=>comment.date===props.comments.userId)
          setPosts(res.data)
        };
        fetchPosts();
      }, [user._id, deleted, editClicked, style, commentVote]);
    console.log("posts")
    console.log(posts.comments)
    const d1 = Date.now();
    const d2 = new Date(props.date);
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

    function userName(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return(users[i].username)
            }
        }
    }
    function userImg(thisId) {
        for (let i=0;i<users.length;i++){
            if(users[i]._id==thisId){
                return(users[i].picture)
            }
        }
    }

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
    const isLiked = likeState.includes(user.username)
    const isDisliked = dislikeState.includes(user.username)
    const [commentState, setCommentState] = useState(props.comments)
    const [commentsState, setCommentsState] = useState(props.comments)
    const upvote = async () => {
        if(!isDisliked){
            if(!isLiked) {
                const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

                let likes=likeState;
                setLikeState(prev=>{
                    if (!prev.includes(user.username)) prev.push(user.username)
                    return prev
                })
                if (!likes.includes(user.username)) likes.push(user.username)
                const edited = res.data.comments.map(x=>{
                    if (x.date === props.comment.date){
                        return (
                            {...x, likes: likes, dislikes:dislikeState}
                        )
                    } else {
                        return x
                    }
                })
                await axios.put(
                    "http://localhost:5000/api/posts/" + props.id,
                    {...props.post, comments: edited}
                );
                setCommentVote(prevVote=>prevVote+1);

            }else{
                const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

                let likes=likeState;
                setLikeState(prev=>{
                    const list = prev.filter((item)=> {
                        return item !== user.username
                    })
                    return list
                })
                likes=likes.filter((item) =>{
                    return item !== user.username
                })
                const edited = res.data.comments.map(x=>{
                    if (x.date === props.comment.date){
                        return (
                            {...x, likes: likes, dislikes:dislikeState}
                            )
                        } else {
                            return x
                        }
                })
                // setCommentState(prev=>{
                //     return {...prev, likes: likes}
                // })
                // setCommentsState(prev=>{
                //     const edited = prev.map(x=>{
                //         if (x === commentState){
                //             return (
                //                 {...x, likes: likes, dislikes:dislikeState}
                //                 )
                //             } else {
                //                 return x
                //             }
                //     })
                //     return(edited)
                // })
                await axios.put(
                    "http://localhost:5000/api/posts/" + props.id,
                    {...props.post, comments: edited}
                )
                setCommentVote(prevVote=>prevVote-1);

            }
        }else{
            const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

                const likes=likeState
                setLikeState(prev=>{
                    if (!prev.includes(user.username)) prev.push(user.username)
                    return prev
                })
                !likes.includes(user.username) && likes.push(user.username)
                let dislikes=dislikeState;
                setDislikeState(prev=>{
                    const list = prev.filter(function(item) {
                        return item !== user.username
                    })
                    return list
                })
                dislikes = dislikes.filter(function(item) {
                    return item !== user.username
                })
                const edited = res.data.comments.map(x=>{
                    if (x.date === props.comment.date){
                        return (
                            {...x, likes: likes, dislikes:dislikes}
                        )
                    } else {
                        return x
                    }
                })
                await axios.put(
                    "http://localhost:5000/api/posts/" + props.id,
                    {...props.post, comments: edited}
                );
                setCommentVote(prevVote=>prevVote+2);
         
          
        }
    }
    const downvote = async () => {
        if(!isLiked){
            if(!isDisliked) {
                const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

                const dislikes=dislikeState
                setDislikeState(prev=>{
                    if (!prev.includes(user.username)) prev.push(user.username)
                    return prev
                })
                !dislikes.includes(user.username) && dislikes.push(user.username)
                const edited = res.data.comments.map(x=>{
                    if (x.date === props.comment.date){
                        return (
                            {...x, likes: likeState, dislikes:dislikes}
                        )
                    } else {
                        return x
                    }
                })
                await axios.put(
                    "http://localhost:5000/api/posts/" + props.id,
                    {...props.post, comments: edited}
                );
                setCommentVote(prevVote=>prevVote-1);

            }else{
                const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

                setDislikeState(prev=>{
                    const list = prev.filter(function(item) {
                        return item !== user.username
                    })
                    return list
                })
                let dislikes=dislikeState;
                dislikes=dislikes.filter(function(item) {
                    return item !== user.username
                })
                const edited = res.data.comments.map(x=>{
                    if (x === props.comment){
                        return (
                            {...x, likes: likeState, dislikes:dislikes}
                        )
                    } else {
                        return x
                    }
                })
                await axios.put(
                    "http://localhost:5000/api/posts/" + props.id,
                    {...props.post, comments: edited}
                );
                setCommentVote(prevVote=>prevVote+1);

            }
        }else{
            const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

            let dislikes=dislikeState
            setDislikeState(prev=>{
                if (!prev.includes(user.username)) prev.push(user.username)
                return prev
            })
            !dislikes.includes(user.username) && dislikes.push(user.username)
            let likes=likeState;
            setLikeState(prev=>{
                const list = prev.filter(function(item) {
                    return item !== user.username
                })
                return list
            })
            likes=likes.filter(function(item) {
                return item !== user.username
            })
            const edited = res.data.comments.map(x=>{
                if (x.date === props.comment.date){
                    return (
                        {...x, likes: likes, dislikes:dislikes}
                    )
                } else {
                    return x
                }
            })
            await axios.put(
                "http://localhost:5000/api/posts/" + props.id,
                {...props.post, comments: edited}
            );
            setCommentVote(prevVote=>prevVote-2);

        }
    }

    function handleDropwdown() {
        setEditClicked(prev=>!prev);
        if(editClicked){
            setStyle(showStyle)
        }else{
            setStyle(hideStyle)
        }
    }
    function handleEditTrue() {
        setIsEdit(true)
        setStyle(hideStyle)
    }
    function handleEditFalse() {
        setIsEdit(false)
    }
    function handleChange(event) {
        setDescValue(event.target.value)
    }
    const handleCheck = async () => {
        const res = await axios.get("http://localhost:5000/api/posts/" + props.post._id);

        setDescription(descValue);
        setIsEdit(false);
        const edited = res.data.comments.map(x=>{
            if (x.date === props.comment.date){
                return (
                    {...x, content: descValue}
                )
            } else {
                return x
            }
        })
        await axios.put(
            `http://localhost:5000/api/posts/${props.id}`,
            {...props.post, comments:edited}
        );
    }
    const handleDeleteComment = async (e) => {
        e.preventDefault()
        const edited = posts.comments.filter(x=>{
            return (x.date !== props.comment.date)
        })
        await axios.put(
            `http://localhost:5000/api/posts/${props.id}`,
            {...props.post, comments:edited}
        );
        setDeleted(!deleted);
    }
    if (!deleted){
        return(
            <div className="comment-grid">
                <div className="comment-image">
                    <img  className="profileimage" src={"http://localhost:5000/images/"+userImg(props.userId)} />
                </div>
                <div className="comment-content">
                    <div className="comment-header">
                        <Link className="comment-username" to={"../"+props.userId}> <b>{userName(props.userId)}</b></Link>
                        <div className="flex-comment">
                            {user._id === props.userId && 
                                <div className="post-edit" style={{marginTop: "10px"}}>
                                    <button onClick={handleDropwdown} className="dots-button"><BsThreeDots /></button>
                                    <div style={style} className="post-edit-buttons">
                                        <AiFillEdit style={{cursor: "pointer"}} onClick={handleEditTrue}/>
                                        <AiFillDelete style={{cursor: "pointer"}} onClick={handleDeleteComment}/>
                                    </div>
                                </div>
                            }
                            <div className="comment-like">
                                {isLiked 
                                    ? <AiFillLike className="comment-like" onClick={upvote}/> 
                                    : <AiOutlineLike className="comment-like" onClick={upvote} /> }
                                <small style={{margin: "10px"}}>{commentVote}</small>
                                {isDisliked 
                                    ? <AiFillDislike className="comment-like" onClick={downvote} /> 
                                    : <AiOutlineDislike className="comment-like" onClick={downvote} />}
                            </div>
                        </div>
                    </div>
                    <small style={{marginLeft: "10px"}}>{dateStr}</small>
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
                </div>
            </div>
        )
    }
}