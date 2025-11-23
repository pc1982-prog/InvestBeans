import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config();

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
        
        const server = app.listen(PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`✅  Server is running on port: ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`📝 API Base: http://localhost:${PORT}/api/v1`);
            console.log('='.repeat(50) + '\n');
            console.log('📚 Available Endpoints:');
            console.log('   - User Auth: /api/v1/users');
            console.log('   - Admin Auth: /api/v1/admin');
            console.log('   - Blogs (Public): /api/v1/blogs');
            console.log('   - Blogs (Admin): /api/v1/blogs/admin');
            console.log('   - Health: /health');
            console.log('='.repeat(50) + '\n');
        });

        process.on('unhandledRejection', (err) => {
            console.error('\n' + '='.repeat(50));
            console.error('❌ UNHANDLED REJECTION! Shutting down...');
            console.error('='.repeat(50));
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
            console.error('='.repeat(50) + '\n');
            
            server.close(() => {
                process.exit(1);
            });
        });

        process.on('SIGTERM', () => {
            console.log('⚠️  SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Process terminated!');
            });
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed!", err);
        process.exit(1);
    });