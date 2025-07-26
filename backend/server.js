require("dotenv").config();
const cookie = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");

app.use(cors({
    origin : "*",
    credentials :false 

}))


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

const vendoritem = require("./routes/vendor.item.route.js");
app.use("/vendor/item", vendoritem);

const port = process.env.PORT
app.listen(port,'0.0.0.0', ()=>{
    console.log(`server is running on port ${port}`);
})