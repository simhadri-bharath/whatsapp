import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message_id: {
        type: String,
        required: true,
        unique: true,
    },
    wa_id: {
        type: String,
        required: true,
        index: true,
    },
    body: {
        type: String,
        required: true,
    },
    from_me: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
    timestamp: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

const Message = mongoose.model('processed_message', messageSchema);
export default Message;