require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

//database connection
const dbConnection = process.env.DBCONNECTION;
mongoose
  .connect(dbConnection)
  .then(()=>{
    console.log("Connected to database")

    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>{
      console.log(`Server is running on ${PORT}`)
    })

  })
  .catch((err)=>{
    console.log('Error connection to the database',err)
  })

