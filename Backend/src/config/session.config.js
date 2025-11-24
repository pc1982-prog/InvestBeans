import MongoStore from 'connect-mongo';

export const createSessionConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME || 'investbeans.sid',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60, 
      touchAfter: 24 * 3600,
      stringify: false,
    }),
    
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: parseInt(process.env.SESSION_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: isProduction ? undefined : undefined,
    },
    
    proxy: isProduction,
  };
};