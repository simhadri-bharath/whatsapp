import fs from 'fs';
import path from 'path'; // **ADDED/ENSURED**
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Message from '../models/Message.js';

// Load env vars
// **THIS IS THE CRUCIAL FIX**
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to DB
// We need to check if MONGO_URI exists BEFORE trying to connect
if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1); // Exit the script with an error code
}
mongoose.connect(process.env.MONGO_URI);


// --- THE REST OF THE SCRIPT REMAINS THE SAME ---

const dataDir = path.join(__dirname, '/_data');

const processFile = async (filePath) => {
    // ... same as before
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const payload = JSON.parse(fileContent);
        const value = payload.metaData.entry[0].changes[0].value;

        if (value.messages) {
            const messageData = value.messages[0];
            const contactData = value.contacts[0];

            await User.findOneAndUpdate(
                { wa_id: contactData.wa_id },
                { name: contactData.profile.name },
                { upsert: true, new: true }
            );

            const from_me = messageData.from === value.metadata.display_phone_number;
            const status = from_me ? 'sent' : 'delivered';

            const existingMessage = await Message.findOne({ message_id: messageData.id });
            if (!existingMessage) {
                await Message.create({
                    message_id: messageData.id,
                    wa_id: contactData.wa_id,
                    body: messageData.text.body,
                    from_me: from_me,
                    status: status,
                    timestamp: new Date(parseInt(messageData.timestamp, 10) * 1000),
                });
                console.log(`INSERTED Message: ${messageData.id}`);
            } else {
                console.log(`SKIPPED Duplicate Message: ${messageData.id}`);
            }
        }
        else if (value.statuses) {
            const statusData = value.statuses[0];
            const updatedMessage = await Message.findOneAndUpdate(
                { message_id: statusData.id },
                { status: statusData.status },
                { new: true }
            );
            if (updatedMessage) {
                console.log(`UPDATED Status for ${statusData.id} to ${statusData.status}`);
            } else {
                console.log(`INFO: Status update for non-existent message: ${statusData.id}`);
            }
        }
    } catch (err) {
        console.error(`Error processing file ${path.basename(filePath)}:`, err);
    }
};

const run = async () => {
    try {
        await Message.deleteMany();
        await User.deleteMany();
        console.log('Database cleared.');

        const files = fs.readdirSync(dataDir).sort(); 

        for (const file of files) {
            if (path.extname(file) === '.json') {
                await processFile(path.join(dataDir, file));
            }
        }
        console.log('All payloads processed successfully!');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        mongoose.connection.close();
    }
};

run();