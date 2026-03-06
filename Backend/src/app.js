import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { configurePassport } from "./config/passport.config.js";
import {
  errorHandler,
  notFound,
} from "./middlewares/errorHandler.middleware.js";

const app = express();


const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
const MONGODB_URI = process.env.MONGODB_URI;
const IS_PRODUCTION = process.env.NODE_ENV === "production";


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(" GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
  process.exit(1);
}

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  console.error(" SESSION_SECRET must be at least 32 characters long");
  process.exit(1);
}


if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
  console.log(" Trust proxy enabled for production");
}


const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  FRONTEND_URL,
  "https://companytask-1-1.onrender.com/"
].filter(Boolean);

const uniqueOrigins = [...new Set(allowedOrigins)];

console.log(" Allowed CORS origins:", uniqueOrigins);


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(" Blocked by CORS:", origin);
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


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

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
  console.log(' Session created:', sessionId);
});

sessionStore.on('destroy', (sessionId) => {
  console.log(' Session destroyed:', sessionId);
});

sessionStore.on('error', (error) => {
  console.error(' Session store error:', error);
});


const sessionConfig = {
  secret: process.env.SESSION_SECRET,
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

console.log(" Session cookie config:", {
  httpOnly: sessionConfig.cookie.httpOnly,
  secure: sessionConfig.cookie.secure,
  sameSite: sessionConfig.cookie.sameSite,
  maxAge: sessionConfig.cookie.maxAge + "ms",
  domain: sessionConfig.cookie.domain || "auto",
});

app.use(session(sessionConfig));


configurePassport(); // Initialize Passport strategies
app.use(passport.initialize());
app.use(passport.session());

// ======================= REQUEST LOGGER (DEVELOPMENT) =======================
if (!IS_PRODUCTION) {
  app.use((req, res, next) => {
    console.log("\n Incoming Request:");
    console.log("  Method:", req.method);
    console.log("  Path:", req.path);
    console.log("  Origin:", req.headers.origin || "No origin");
    console.log("  Cookies:", Object.keys(req.cookies).length > 0 ? Object.keys(req.cookies) : "None");
    console.log("  Session ID:", req.sessionID || "No session");
    console.log("  Authenticated:", req.isAuthenticated ? req.isAuthenticated() : false);
    next();
  });
}


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});


import userRouter from "./routes/user.routes.js";
import googleAuthRouter from "./routes/googleAuth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import beansOfWisdom from "./routes/beanOfWisdom.routes.js";
import insightRouter from "./routes/insight.routes.js";
import globalMarketsRouter from "./routes/globalMarkets.routes.js";
import marketHistoryRouter from "./routes/marketHistory.routes.js";
import ipoRouter from "./routes/Ipo.routes.js";
import testimonialRouter from "./routes/Testimonial.routes.js";
import subscriberRouter from "./routes/Subscriber.routes.js";
import KiteRouter from "./routes/kite.routes.js"



//payment routes
import paymentRouter from "./routes/Payment.routes.js"





app.use("/api/v1/users", userRouter);
app.use("/auth", googleAuthRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/beans-of-wisdom", beansOfWisdom);
app.use("/api/v1/insights", insightRouter);

//payment routes

app.use('/api/v1',paymentRouter)

app.use("/api/v1/markets", globalMarketsRouter);
app.use("/api/v1/markets", marketHistoryRouter);
app.use("/api/v1/kite", KiteRouter);
app.use("/api/v1/subscribe", subscriberRouter);
app.use("/api/v1/ipo", ipoRouter);
app.use("/api/v1/testimonials", testimonialRouter);








app.use(notFound);
app.use(errorHandler);

export { app };