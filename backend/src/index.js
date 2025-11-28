const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const sosRoutes = require('./routes/sosRoutes');

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api/sos', sosRoutes);

app.get('/', (req, res) => {
    res.send('Hello from Backend!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
