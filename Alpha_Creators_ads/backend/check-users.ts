import mongoose from 'mongoose';
import User from './src/models/User';
import config from './src/config';

const listUsers = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ${u.email} (Username: ${u.username}, Verified: ${u.isEmailVerified})`);
            console.log(`  Password hash: ${u.password ? 'Present' : 'Missing'}`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

listUsers();
