import mongoose from 'mongoose';
//Creation du tableau de User
const roomSchema = new mongoose.Schema({
    title: String,
    userId: {
        type: Array,
        default: []
    },
    desc: String,
    cover: String,
    followers: {
        type: Array,
        default: []
    },
    type: String,
});

const Room = mongoose.model('Room', roomSchema);

export default Room;