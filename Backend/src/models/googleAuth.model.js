import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const googleAuthSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Generate Access Token for JWT
googleAuthSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.displayName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7d'
        }
    );
};

// Generate Refresh Token for JWT
googleAuthSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d'
        }
    );
};

const GoogleAuth = mongoose.model('GoogleAuth', googleAuthSchema);
       
export default GoogleAuth;