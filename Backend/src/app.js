import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
import GoogleAuth from "./models/googleAuth.model.js";
import {
  errorHandler,
  notFound,
} from "./middlewares/errorHandler.middleware.js";

const app = express();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/investbeans";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (!clientId || !clientSecret) {
  console.error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env");
  process.exit(1);
}



if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
  console.log("✅ Trust proxy enabled for production");
}


const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8000",
  "https://investbeans-1.onrender.com", 
  FRONTEND_URL,
];


const uniqueOrigins = [...new Set(allowedOrigins.filter(Boolean))];



app.use(
  cors({
    origin: function (origin, callback) {
     
      if (!origin) {
   
        return callback(null, true);
      }
      
      if (uniqueOrigins.includes(origin)) {
       
        callback(null, true);
      } else {
      
        callback(null, true);
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);


app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: "sessions",
  ttl: 7 * 24 * 60 * 60, 
  autoRemove: "native",
  touchAfter: 24 * 3600, 
  stringify: false, 
});


sessionStore.on('create', (sessionId) => {

});

sessionStore.on('update', (sessionId) => {

});

sessionStore.on('destroy', (sessionId) => {

});

sessionStore.on('error', (error) => {

});


const sessionConfig = {
  secret: process.env.SESSION_SECRET || "investbeans-super-secret-2025-change-this-in-production",
  name: "investbeans.sid", 
  store: sessionStore,
  resave: false, 
  saveUninitialized: false, 
  rolling: true, 
  proxy: IS_PRODUCTION,
  cookie: {
    httpOnly: true, 
    secure: false, 
    sameSite: "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", 
    domain: undefined, 
  },
};

console.log("🍪 Session cookie config:", {
  httpOnly: sessionConfig.cookie.httpOnly,
  secure: sessionConfig.cookie.secure,
  sameSite: sessionConfig.cookie.sameSite,
  maxAge: sessionConfig.cookie.maxAge,
  domain: sessionConfig.cookie.domain || 'auto',
});

app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  console.log("\n📨 Incoming Request:");
  console.log("  Method:", req.method);
  console.log("  Path:", req.path);
  console.log("  Origin:", req.headers.origin);
  console.log("  Cookies:", Object.keys(req.cookies).length > 0 ? req.cookies : "No cookies");
  console.log("  Session ID:", req.sessionID || "No session");
  console.log("  Authenticated:", req.isAuthenticated ? req.isAuthenticated() : false);
  console.log("  User:", req.user ? req.user.email : "No user");
  next();
});

passport.serializeUser((user, done) => {
  console.log("📝 Serializing user:", user._id.toString());
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
  
    const user = await GoogleAuth.findById(id);
    if (!user) {
      
      return done(null, false);
    }
  
    done(null, user);
  } catch (err) {
    
    done(err, null);
  }
});

// ======================= GOOGLE OAUTH STRATEGY =======================
passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        

        let user = await GoogleAuth.findOne({ googleId: profile.id });

        if (!user) {
          user = await GoogleAuth.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value.toLowerCase(),
            image: profile.photos[0]?.value || null,
          });
          console.log("✨ New Google user created:", user.email);
        } else {
          console.log("✅ Existing Google user found:", user.email);
        }

        return done(null, user);
      } catch (err) {
        
        return done(err, null);
      }
    }
  )
);


app.get(
  "/auth/google",
  (req, res, next) => {
   
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/signin?googleAuth=failure`,
  }),
  async (req, res) => {
 
    
    req.session.regenerate((err) => {
      if (err) {
      
        return res.redirect(`${FRONTEND_URL}/signin?googleAuth=failure`);
      }
      
      // Store user in session
      req.session.passport = { user: req.user._id.toString() };
      
      // Save session
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.redirect(`${FRONTEND_URL}/signin?googleAuth=failure`);
        }
        
        
        // Add a small delay to ensure session is fully written to MongoDB
        setTimeout(() => {
          res.redirect(`${FRONTEND_URL}?googleAuth=success`);
        }, 200);
      });
    });
  }
);

// ======================= TEST ENDPOINT =======================
app.get("/api/v1/auth/test-session", (req, res) => {
  res.json({
    sessionId: req.sessionID,
    authenticated: req.isAuthenticated(),
    user: req.user ? {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.displayName,
    } : null,
    cookies: req.cookies,
  });
});

// ======================= ROUTES =======================
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

// ======================= ERROR HANDLING =======================
app.use(notFound);
app.use(errorHandler);

export { app };