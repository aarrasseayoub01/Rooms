import express from 'express';

import {getPost, createPost,feedPosts, updatePost, deletePost, profilePosts, myPost, allposts, isPostExist} from '../controllers/posts.js'

const router = express.Router();
//les urls qu'on peut acceder concernant les posts.
router.get('/:id', getPost);
router.get('/profile/:username', profilePosts)
router.get("/timeline/:userId", feedPosts)
router.get("/profile1/:userId", profilePosts)
router.get("/:postId", myPost);
router.get("/allposts/:id", allposts);
router.get("/isPostExist/:PostId", isPostExist)
router.post('/', createPost); 
router.put("/:id", updatePost)
router.delete("/:id", deletePost)
export default router;