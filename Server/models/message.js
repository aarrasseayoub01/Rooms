import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    date: {
        type: Date,
        default: new Date()
    }
  },
);

const Message = mongoose.model("Message", MessageSchema);
export default Message