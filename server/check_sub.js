require('dotenv').config();
const mongoose = require('mongoose');
const Subscription = require('./src/models/Subscription');
const User = require('./src/models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const userId = '69341071e23715c83612c6d0'; // User ID from conversation

        console.log('Checking for user:', userId);

        const sub = await Subscription.findOne({ userId });
        console.log('Found Subscription:', sub);

        if (sub) {
            console.log('Status:', sub.status);
            console.log('Period End:', sub.currentPeriodEnd);
            console.log('Is valid date?', sub.currentPeriodEnd instanceof Date);
            console.log('Compare to now:', sub.currentPeriodEnd >= new Date());
        } else {
            console.log('No subscription found for this user.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

check();
