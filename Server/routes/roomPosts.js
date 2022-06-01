import express from 'express';

import {getPost, createPost,  updatePost, deletePost, myPost, profilePosts, allRoomposts} from '../controllers/roomPosts.js'

const router = express.Router();
//les urls qu'on peut acceder concernant les posts d'une room.
router.get('/:id', getPost);
router.get("/:postId", myPost)
router.get("/allroomposts", allRoomposts)
router.post('/', createPost);
router.put("/:id", updatePost)
router.delete("/:id", deletePost)
router.get("/posts/:id", profilePosts)
export default router;