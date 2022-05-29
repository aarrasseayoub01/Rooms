import Room from '../models/rooms.js'
import bcrypt from "bcrypt" //Sert a rendre les mots de passe crypte dans la base des donnees.

//Les fonctions qu'on executera lorsqu'on accedera a un url dans le fichier ./routes/users.js

export const create = async (req, res) => {

    const room = req.body;

     const newRoom = new  Room({
         title:room.title,
         desc:room.desc,
         cover:room.cover,
         userId:room.userId,
         type:room.type,
     });  
    try{
        const roomTitle = await Room.findOne({title: newRoom.title} ) 
        if(!roomTitle) {
          const croom = await newRoom.save();  
          res.status(201).json(croom);
        } else {
          res.status(404).json({status:false})
        }
    } catch (error) {
         res.status(404).send({ message: error.message });
    }
}



export const myRoom = async (req, res) => {
    try {
      const room = await Room.findOne({_id:req.params.roomId});
      res.status(200).json(room);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  
export const getRooms = async (req, res) => {
    try {
      const res = await Room.find()

      let room = []
      let room1 = []
      for(let i=0;i<res.length;i++){
        for(let j=0;j<res[i].userId.length;j++){

        if(res[i].userId[j]===req.params.userId){
          

          room = await Room.find({userId:res[i].userId});
          room1=[...room1, ...room]
        }
      }
    }
       console.log(room1)
      res.status(200).json(room1);

    } catch (err) {
      res.status(500).json(err);
    }
  };

   export const update = async (req, res) => {
      try {
        const room = await Room.findByIdAndUpdate(req.params.id, {
          $set: {...req.body},
        });
        res.status(200).json("Room has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } 
  ;
 
