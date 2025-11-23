const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Default to 500 server error
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === 'development') {
        console.log('\n' + '='.repeat(80));
        console.log('🔴 ERROR OCCURRED!');
        console.log('='.repeat(80));
        console.log('📍 Location:', getErrorLocation(err.stack));
        console.log('📝 Message:', err.message);
        console.log('🔢 Status Code:', statusCode);
        console.log('📋 Request Info:', err.requestInfo);
        console.log('📚 Stack Trace:');
        console.log(err.stack);
        console.log('='.repeat(80) + '\n');
    }

    // Mongoose Bad ObjectId Error
    if (err.name === 'CastError') {
        message = `Resource not found. Invalid: ${err.path}`;
        statusCode = 400;
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value: ${field}. Please use another value!`;
        statusCode = 400;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        message = `Invalid input data: ${errors.join(', ')}`;
        statusCode = 400;
    }

    
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again!';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Your token has expired! Please log in again.';
        statusCode = 401;
    }


    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            error: err,
            stack: err.stack,
            location: getErrorLocation(err.stack),
            requestInfo: err.requestInfo
        })
    });
};

const getErrorLocation = (stack) => {
    if (!stack) return 'Unknown location';
    
    const stackLines = stack.split('\n');
    for (let i = 1; i < stackLines.length; i++) {
        const line = stackLines[i].trim();
        if (line.includes('at ')) {
            return line;
        }
    }
    return 'Unknown location';
};


const notFound = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

export { errorHandler, notFound };