require("dotenv").config();
const cookie = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// const dbconnect  = require("./db/db.js");
// dbconnect();
app.use(cookie());
app.use(express.urlencoded({ extended: true }));




app.use((req, res, next) => {
  const time = new Date().toLocaleString(); // Current local time
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

// const authroute = require("./routes/auth.route.js");
// app.use("/api/auth",authroute);

// // this api endpoint made for blood request add in database 
// const bloodrequest = require("./routes/blood-request.route.js");
// app.use("/api" ,bloodrequest);

// // this api endoint made for finding blood donars in database
// const blooddonors = require("./routes/blooddonor.route.js");
// app.use("/api/blood", blooddonors);

// const donorresponse = require("./routes/donor.route.js");
// app.use("/api",donorresponse);

const port = process.env.PORT
app.listen(port,'0.0.0.0', ()=>{
    console.log(`server is running on port ${port}`);
})