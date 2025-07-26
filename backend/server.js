require("dotenv").config();
const cookie = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


const dbconnect  = require("./db/db.js");
dbconnect();
app.use(cookie());
app.use(express.urlencoded({ extended: true }));




app.use((req, res, next) => {
  const time = new Date().toLocaleString(); // Current local time
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

const authroute = require("./routes/auth.route.js");
app.use("/api/auth",authroute);

const supplierroute = require("./routes/supplier.route.js");
app.use('/api/supplier' , supplierroute);

// // this api endoint made for finding blood donars in database
// const blooddonors = require("./routes/blooddonor.route.js");
// app.use("/api/blood", blooddonors);

// const donorresponse = require("./routes/donor.route.js");
// app.use("/api",donorresponse);

const port = process.env.PORT
app.listen(port,'0.0.0.0', ()=>{
    console.log(`server is running on port ${port}`);
})