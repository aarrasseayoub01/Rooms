import mongoose from 'mongoose';
//Creation du tableau du Post
const roomsPostSchema = new mongoose.Schema({
    title: String,
    desc: String,
    userId: {
        type: Array,
        default: []
    },
    photo: {
        type: String,
        default:'',
      },
    // selectedFile: String,
    likes: {
        type: Array,
        default: []
    },
    dislikes: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: new Date() //On prend le temps de la creation du post comme date par defaut.
    }, 
    room: String,
    comments: Array,
    roomers: {
        type: Number,
        default: 0
    },
    
});

const RoomsPostMessage = mongoose.model('RoomsPostMessage', roomsPostSchema);

export default RoomsPostMessage;