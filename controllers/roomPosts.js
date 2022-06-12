import RoomPostMessage from '../models/roomsPostMessage.js'
import User from '../models/user.js'
import Room from '../models/rooms.js'
//Les fonctions qu'on executera lorsqu'on accedera a un url dans le fichier ./routes/posts.js
export const getPost = async (req, res) => {
    try {
        const post = await RoomPostMessage.findById(req.params.id);
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json(err);
      }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new RoomPostMessage(post)
    try{
        const savedPost = await newPost.save();
        
        res.status(201).json(savedPost);

    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const allPosts = async (req, res) => {
    try {
      const user = await User.findOne({_id:req.params.id})
      const SortedSaved = user.saved.sort((p1, p2)=>{
        return (new Date(p2.saveDate) - new Date(p1.saveDate))
      });

      const idListe = SortedSaved.map(p=>p.id)

      const posts=[];
      for (let i=0;i<idListe.length;i++){
        var post = await RoomPostMessage.findOne({_id: idListe[i]})
        if (post!==null){
        post.saveDate = SortedSaved[i].saveDate
        posts.push(post)
        }
      } 
      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json(err);
    }
  };
// export const allRoomPosts = async (req, res) =>{
//   try{
//     const allroomposts = await RoomPostMessage.find();
//     res.status(200).json(allroomposts);
//   } catch(err){
//     res.status(500).json(err);
//   }
// }
export const myPost = async (req, res) => {
    try {
      const posts = await RoomPostMessage.findOne({ _id: req.params.postId });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  
  export const updatePost = async (req, res) => {
    
    try {
      const post = await RoomPostMessage.findById(req.params.id);
     

      if (post.userId[0] === req.body.userId[0]) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
   export const deletePost = async (req, res) => {
    try {
      const post = await RoomPostMessage.findById(req.params.id);
     
      if (post.userId[0] === req.body.userId) {
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
  export const profilePosts = async (req, res) => {
    try {
      const currentRoom = await Room.findById(req.params.id);
      const roomPosts = await RoomPostMessage.find({ room: currentRoom._id});
      
      res.status(200).json(roomPosts);
    } catch (err) {
      res.status(500).json(err);
    }
  };