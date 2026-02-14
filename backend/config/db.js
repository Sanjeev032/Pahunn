const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
            });

            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

            // Handle initial connection errors
            mongoose.connection.on('error', err => {
                console.error(`MongoDB connection error: ${err}`.red);
            });

            // Handle disconnection
            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected'.yellow);
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                await mongoose.connection.close();
                console.log('MongoDB connection closed due to app termination'.magenta);
                process.exit(0);
            });

            return conn; // Success, exit loop
        } catch (error) {
            retries++;
            console.error(`Error: ${error.message}`.red.bold);
            if (retries === maxRetries) {
                console.error(`Could not connect to MongoDB after ${maxRetries} attempts`.red.bold);
                process.exit(1);
            }
            console.log(`Retrying connection (${retries}/${maxRetries})...`.yellow);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        }
    }
};

module.exports = connectDB;
