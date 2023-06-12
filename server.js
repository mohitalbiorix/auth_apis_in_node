// env file configuration
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

// json configuration
app.use(express.json());

// cors security
const cors = require('cors');
app.use(cors());

// router
const userRoute = require('./routes/Users');
const port = process.env.PORT || 3000;

// database connection
const connectDB = require('./config/connectdb');
const DATABASE_URL = process.env.DATABASE_URL;


connectDB(DATABASE_URL);

app.use(express.json());

app.use('/api/users', userRoute);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})