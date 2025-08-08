import mongoose from 'mongoose'; // <-- THE MISSING LINE
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all conversations grouped by user
// @route   GET /api/conversations
// @access  Public
const getConversations = async (req, res) => {
    try {
        const conversations = await Message.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: "$wa_id",
                    lastMessage: { $first: "$body" },
                    lastMessageTimestamp: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "wa_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    _id: 0,
                    wa_id: "$_id",
                    name: "$userInfo.name",
                    lastMessage: "$lastMessage",
                    lastMessageTimestamp: "$lastMessageTimestamp"
                }
            },
            { $sort: { lastMessageTimestamp: -1 } }
        ]);

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all messages for a specific user
// @route   GET /api/messages/:wa_id
// @access  Public
const getMessagesByUser = async (req, res) => {
    try {
        const messages = await Message.find({ wa_id: req.params.wa_id }).sort({ timestamp: 'asc' });
        const user = await User.findOne({ wa_id: req.params.wa_id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            userInfo: {
                name: user.name,
                wa_id: user.wa_id,
            },
            messages: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Create a new demo message (for Task 3)
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
    try {
        const { wa_id, body } = req.body;

        if (!wa_id || !body) {
            return res.status(400).json({ message: 'wa_id and body are required' });
        }
        
        const newMessage = await Message.create({
            message_id: `demo-${new mongoose.Types.ObjectId()}`,
            wa_id: wa_id,
            body: body,
            from_me: true,
            status: 'sent',
            timestamp: new Date(),
        });

        // --- DIAGNOSTIC LOGS ---
console.log('Backend: Preparing to emit "newMessage" event.');
console.log('Backend: Emitting this message object:', newMessage);
// --- END DIAGNOSTIC LOGS ---
        // --- WEBSOCKET EMIT ---
        // Emit the new message to all connected clients
        req.io.emit('newMessage', newMessage);

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export { getConversations, getMessagesByUser, sendMessage };