require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initCronJobs } = require('./utils/cronJobs');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Initialize cron jobs
initCronJobs();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

