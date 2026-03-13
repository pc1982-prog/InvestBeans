import dotenv from "dotenv";
import http from "http";                              // ← NEW
import { Server as SocketIOServer } from "socket.io"; // ← NEW
import connectDB from "./db/index.js";
import Razorpay from "razorpay";
import { app } from './app.js';
import { kiteWS } from "./utils/kiteWebSocket.js";    // ← NEW

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
});

const requiredEnvVars = [
    'MONGODB_URI',
    'PORT',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'ACCESS_TOKEN_EXPIRY',
    'REFRESH_TOKEN_EXPIRY',
    'ADMIN_ACCESS_TOKEN_SECRET',
    'ADMIN_REFRESH_TOKEN_SECRET',
    'ADMIN_REGISTRATION_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n💡 Please check your .env file and add the missing variables.');
    process.exit(1);
}

process.on('uncaughtException', (err) => {
    console.error('\n' + '='.repeat(50));
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    console.error('='.repeat(50));
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('='.repeat(50) + '\n');
    process.exit(1);
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

        // ── NEW: HTTP server wrap (Express + Socket.IO same port) ──────
        const httpServer = http.createServer(app);

        const io = new SocketIOServer(httpServer, {
            cors: {
                origin: [
                    "http://localhost:8080",
                    "http://localhost:5173",
                    "http://127.0.0.1:8080",
                    "http://127.0.0.1:5173",
                    FRONTEND_URL,
                    "https://companytask-1-1.onrender.com",
                ],
                methods: ["GET", "POST"],
                credentials: true,
            },
            transports: ["websocket", "polling"],
        });

        // Attach Socket.IO to Kite WebSocket manager
        kiteWS.attachSocketIO(io);

        io.on("connection", (socket) => {
            console.log(`🖥️  Frontend WS connected: ${socket.id}`);

            // Send cached ticks immediately so UI doesn't wait
            const cached = kiteWS.getLastTicks();
            if (Object.keys(cached).length > 0) {
                socket.emit("kite:ticks", cached);
            }
            socket.emit("kite:status", { connected: kiteWS.isConnected() });

            socket.on("disconnect", () => {
                console.log(`🖥️  Frontend WS disconnected: ${socket.id}`);
            });
        });
        // ── END NEW ────────────────────────────────────────────────────

        // ── CHANGED: httpServer.listen instead of app.listen ──────────
        const server = httpServer.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`✅  Server is running on port: ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`📝 API Base: http://localhost:${PORT}/api/v1`);
            console.log(`📡 Socket.IO: ready`);
            console.log('='.repeat(50) + '\n');
            console.log('📚 Available Endpoints:');
            console.log('   - User Auth: /api/v1/users');
            console.log('   - Admin Auth: /api/v1/admin');
            console.log('   - Blogs (Public): /api/v1/blogs');
            console.log('   - Blogs (Admin): /api/v1/blogs/admin');
            console.log('   - Kite: /api/v1/kite');
            console.log('   - Health: /health');
            console.log('='.repeat(50) + '\n');

            // ── NEW: Start Kite WebSocket after server is up ───────────
            const apiKey      = process.env.KITE_API_KEY;
            const accessToken = process.env.KITE_ACCESS_TOKEN;
            if (apiKey && accessToken) {
                console.log("🔌 Starting Kite WebSocket streaming...");
                kiteWS.connect(apiKey, accessToken);
            } else {
                console.warn("⚠️  KITE_ACCESS_TOKEN not set — visit /api/v1/kite/login to authenticate");
            }
            // ── END NEW ────────────────────────────────────────────────
        });

        process.on('unhandledRejection', (err) => {
            console.error('\n' + '='.repeat(50));
            console.error('❌ UNHANDLED REJECTION! Shutting down...');
            console.error('='.repeat(50));
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
            console.error('='.repeat(50) + '\n');
            server.close(() => { process.exit(1); });
        });

        process.on('SIGTERM', () => {
            console.log('⚠️  SIGTERM received. Shutting down gracefully...');
            server.close(() => { console.log('✅ Process terminated!'); });
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed!", err);
        process.exit(1);
    });