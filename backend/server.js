require("dotenv").config();
const cookie = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");


app.use(cors({
  origin: "https://bucolic-dasik-cfa237.netlify.app", 
  credentials: true
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


app.get("/" , (req,res)=>{
   res.send({
    activestaus : true ,
    message : "server is running"
   })
})
const authroute = require("./routes/auth.route.js");
app.use("/api/auth",authroute);

const supplierroute = require("./routes/supplier.route.js");
app.use('/api/supplier' , supplierroute);

const vendoritem = require("./routes/vendor.item.route.js");
app.use("/api/vendor/item", vendoritem);

const vendorroute = require("./routes/vendor.route.js");
app.use("/api/vendor",vendorroute);

const chatbotroute= require("./routes/chat.route.js");
app.use("/api/chatbot", chatbotroute);

const port = process.env.PORT
app.listen(port,'0.0.0.0', ()=>{
    console.log(`server is running on port ${port}`);
})
