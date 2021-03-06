"use strict";
var express = require('express');
var app = express();
var usersrouter=require('./routes/user');
var productsrouter=require('./routes/product');
var uploadsrouter=require('./routes/upload');
var orderrouter=require('./routes/order');
 var aunthenticateMiddleware=require('./routes/aunthenticate');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());
 app.use("/user",usersrouter);
 app.use("/product",productsrouter);
 app.use("/upload",uploadsrouter);
 app.use("/order",orderrouter);
app.listen(8000, function(){
  console.log("server is listening on port: 8000");
});
module.exports = app;