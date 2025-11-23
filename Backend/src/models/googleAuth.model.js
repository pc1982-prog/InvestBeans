import mongoose from 'mongoose';

const googleAuthSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image:String,
}, { timestamps: true });

const GoogleAuth =  mongoose.model('GoogleAuth', googleAuthSchema);
       
export default GoogleAuth;