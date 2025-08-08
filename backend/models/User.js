import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    wa_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;