const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const userRoute = require('./Routes/user.route')
const gameRoute = require('./Routes/game.route')
const playerRoute = require("./Routes/player.route")
const paymentRoute = require("./Routes/payment.route")

const PORT = process.env.PORT || 3000
const app = express();
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'game',
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('./Public')));

app.get('/', (req, res)=>{
    res.send("hello backend");
})
app.use('/user', userRoute);
app.use('/player', playerRoute);
app.use('/game', gameRoute);
app.use('/payment', paymentRoute);

app.listen(PORT,()=>(console.log(`server run at port ${PORT}`)))