import PostMessage from '../models/postMessage.js'
import User from '../models/user.js'
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

export const allposts = async (req, res) => {
  try {
    const user = await User.findOne({_id:req.params.id})
    const SortedSaved = user.saved.sort((p1, p2)=>{
      return (new Date(p2.saveDate) - new Date(p1.saveDate))
    });
    const idListe = SortedSaved.map(p=>p.id)
    const posts =[];
    for (let i=0;i<idListe.length;i++){
      var post = await PostMessage.findOne({_id: idListe[i]})
      if(post!==null){
      post.saveDate = SortedSaved[i].saveDatey
      posts.push(post)
      }
    }
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err);
  }
}; 

export const isPostExist = async (req, res) => {
  try {
    const post = await PostMessage.findOne({_id: req.params.PostId});
    var state;
    post ? state = false : state = true;
    res.status(200).json(state);
  } catch(err){
    res.status(500).json(err);
  }
}

export const myPost = async (req, res) => {
  try {
    const posts = await PostMessage.findOne({ _id: req.params.postId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const feedPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await PostMessage.find({ userId: currentUser._id, sharer:"" });
    const userPosts1 = await PostMessage.find({sharer: currentUser._id});
    const fPost = [...currentUser.following]
    const fPost1 = [...currentUser.following]
    fPost.push("")
    fPost1.push(currentUser._id)
    const friendPosts = await Promise.all(
      fPost.map((friendId) => {
        return PostMessage.find({ userId: friendId, sharer:{ $in : fPost} });
      })
    );
    const friendPosts1 = await Promise.all(
      currentUser.following.map((friendId) => {
        return PostMessage.find({ sharer: friendId, userId:{ $nin: fPost1} });
      })
    );
    
    const posts = userPosts.concat(friendPosts.flat())
    const posts1= posts.concat(friendPosts1.flat())
    const posts2= posts1.concat(userPosts1)
    res.status(200).json(posts2);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const profilePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await PostMessage.find({ userId: currentUser._id, sharer: ""});
    const userSharedPosts = await PostMessage.find({ sharer: currentUser._id})
    const posts = userPosts.concat(userSharedPosts)
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
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};