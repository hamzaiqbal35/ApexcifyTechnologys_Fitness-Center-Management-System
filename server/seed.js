require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const seedAdmin = async () => {
    await connectDB();

    try {
        const adminExists = await User.findOne({ email: 'admin@fittrack.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create admin
        await User.create({
            name: 'Admin User',
            email: 'admin@fittrack.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
