import express from 'express';
import { getConversations, getMessagesByUser, sendMessage } from '../controllers/conversationController.js';

const router = express.Router();

// Route to get the list of all conversations
router.get('/conversations', getConversations);

// Route to get all messages for a specific conversation/user
router.get('/messages/:wa_id', getMessagesByUser);

// Route to post a new message (for the demo send functionality)
router.post('/messages', sendMessage);


export default router;