import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import GoogleAuth from "../models/googleAuth.model.js";

/**
 * Configure Passport Google OAuth Strategy
 * This handles the Google authentication flow
 */
export const configurePassport = () => {
  // Serialize user ID into session
  passport.serializeUser((user, done) => {
    console.log('🔐 Serializing user:', user._id.toString());
    done(null, user._id.toString());
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('🔓 Deserializing user:', id);
      const user = await GoogleAuth.findById(id);
      
      if (!user) {
        console.log('❌ User not found in database');
        return done(null, false);
      }
      
      console.log('✅ User deserialized:', user.email);
      done(null, user);
    } catch (err) {
      console.error('❌ Deserialization error:', err);
      done(err, null);
    }
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('🎯 Google OAuth callback triggered');
          console.log('👤 Profile:', {
            id: profile.id,
            email: profile.emails[0]?.value,
            name: profile.displayName
          });

          // Check if user exists
          let user = await GoogleAuth.findOne({ googleId: profile.id });

          if (!user) {
            // Create new user
            user = await GoogleAuth.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value.toLowerCase(),
              image: profile.photos[0]?.value || null,
            });
            console.log('✨ New Google user created:', user.email);
          } else {
            // Update existing user info (in case they changed profile pic/name)
            user.displayName = profile.displayName;
            user.image = profile.photos[0]?.value || user.image;
            await user.save();
            console.log('✅ Existing Google user updated:', user.email);
          }

          return done(null, user);
        } catch (err) {
          console.error('❌ Google OAuth strategy error:', err);
          return done(err, null);
        }
      }
    )
  );
};

export default configurePassport;