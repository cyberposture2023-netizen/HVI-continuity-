const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB at: ' + process.env.MONGODB_URI);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hvi-continuity', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0
        });

        console.log('MongoDB Connected: ' + conn.connection.host);
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Server will start without database connection. Some features will be limited.');
        return false;
    }
};

module.exports = connectDB;
