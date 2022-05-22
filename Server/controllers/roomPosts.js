import PostMessage from '../models/postMessage.js'
import Room from '../models/rooms.js'
//Les fonctions qu'on executera lorsqu'on accedera a un url dans le fichier ./routes/posts.js
export const getPost = async (req, res) => {
    try {
        const post = await PostMessage.findById(req.params.id);
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json(err);
      }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post)
    try{
        const savedPost = await newPost.save();
        
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const allPosts = async (req, res) => {
    try {
      const room = await Room.findOne({ userId: req.params.userId });
      const posts = await PostMessage.find({ userId: room._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
export const myPost = async (req, res) => {
    try {
      const posts = await PostMessage.findOne({ _id: req.params.postId });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  
  export const updatePost = async (req, res) => {
    try {
      const post = await PostMessage.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
   export const deletePost = async (req, res) => {
    try {
      const post = await PostMessage.findById(req.params.id);
      if (post.userId === req.body.userId) {
        console.log("after")
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };